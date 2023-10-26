import storage from './core/storage'
import event from './core/event'
import noter from './noter'
import wallpaper from './wallpaper'

const setting = {
    isOpen: false,
    blob_buffer_url: null,
}

setting.render = () => {
    // Render wallpaper
    const walW = Math.floor(window.settings_wallpapers.clientWidth / 6 - 11)
    const walH = Math.floor((walW * holder.w_h) / holder.w_w)

    window.settings_wallpapers.innerHTML = Array(12)
        .fill(1)
        .map(() => {
            return `
            <div class="settings-wall-pre"
                style="width: ${walW}px; height: ${walH}px; background-image: url(/img/placeholder.png)"
            ></div>
            `
        })
        .join('')

    chrome.storage.local.get('wallpapers', ({ wallpapers }) => {
        window.settings_wallpapers.innerHTML = wallpapers
            .map((wall, index) => {
                let className = 'settings-wall-pre'

                if (wall.active) {
                    className += ' active'
                }

                let inner = ''

                if (wall.editbale) {
                    inner += `<span click-emit="setting_wallpaper_edit:${index}">EDIT</span>`
                }

                return `
                <div class="${className}"
                    style="width: ${walW}px; height: ${walH}px; background-image: url(${wall.url})"
                    click-emit="setting_wallpaper_toggle:${index}"
                >${inner}</div>
                `
            })
            .join('')
    })

    // Render config
    window.setting_config_input.value = JSON.stringify(storage.config, null, 2)
}

setting.toggle = (state) => {
    if (state === undefined) {
        state = !setting.isOpen
    }

    setting.isOpen = state

    if (state) {
        window.setting_box.removeClass('hidden')
        setting.render()
    } else {
        window.setting_box.addClass('hidden')
    }
}

event.on('setting_close', () => {
    setting.toggle(false)
})

event.on('setting_open', () => {
    setting.toggle(true)
})

event.on('setting_backup', async () => {
    const now = new Date()
    const local = await chrome.storage.local.get()
    const data = {}

    data.local = local
    data.storage = window.localStorage

    const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anc = document.createElement('a')

    anc.href = url
    anc.download = 'sein-backup-' + now.toLocaleDateString().replace(/\//g, '-') + '.json'

    anc.click()
    URL.revokeObjectURL(url)
})

event.on('setting_restore', () => {
    const input = document.createElement('input')
    input.type = 'file'

    input.addEventListener(
        'change',
        () => {
            const file = input.files[0]
            const reader = new FileReader()

            reader.addEventListener('load', async () => {
                const { local, storage, notes } = JSON.parse(reader.result)

                if (storage) {
                    for (const key of Object.keys(storage)) {
                        window.localStorage[key] = storage[key]
                    }
                }

                if (local) {
                    await chrome.storage.local.set(local)
                }

                if (notes) {
                    noter.notes = notes
                    noter.save()
                }

                window.alert('Restore completed')
                window.location.reload()
            })

            reader.readAsText(file)
        },
        { once: true },
    )

    input.click()
})

event.on('setting_config_save', () => {
    try {
        const config = JSON.parse(window.setting_config_input.value)
        storage.config = config
    } catch (error) {
        console.error(error)
        return window.alert('Parse and save config error')
    }

    window.alert('Save config success')
})

event.on('setting_wallpaper_toggle', (index, { target }) => {
    index = +index

    chrome.storage.local.get('wallpapers', ({ wallpapers }) => {
        const isActive = target.className.indexOf('active') !== -1

        wallpapers[index].active = !isActive
        wallpaper.cache(wallpapers)

        chrome.storage.local.set({
            wallpapers,
        })

        if (isActive) {
            target.removeClass('active')
        } else {
            target.addClass('active')
        }
    })
})

event.on('setting_wallpaper_edit', (index, { target }) => {
    index = +index

    const input = document.createElement('input')
    input.type = 'file'

    input.addEventListener(
        'change',
        () => {
            const file = input.files[0]
            const reader = new FileReader()

            reader.addEventListener('load', async () => {
                if (file.type.startsWith('video/')) {
                    const video = document.createElement('video')
                    const source = document.createElement('source')
                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')

                    video.className = 'invisible'
                    canvas.className = 'invisible'

                    source.setAttribute('src', reader.result)
                    source.setAttribute('type', file.type)
                    video.appendChild(source)
                    window.setting_box.appendChild(video)

                    video.addEventListener('canplaythrough', () => {
                        setTimeout(async () => {
                            canvas.width = video.videoWidth
                            canvas.height = video.videoHeight
                            window.setting_box.appendChild(canvas)

                            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

                            const { wallpapers } = await chrome.storage.local.get('wallpapers')
                            const result = canvas.toDataURL('image/jpeg')

                            window.setting_box.removeChild(video)
                            window.setting_box.removeChild(canvas)

                            wallpapers[index].url = result
                            wallpapers[index].video = index

                            wallpaper.cache(wallpapers)

                            chrome.storage.local.set({
                                wallpapers,
                                [`wallpaper_videos_${index}`]: reader.result,
                            })

                            const item = target.parentElement
                            item.style.backgroundImage = `url(${result})`
                        }, 200)
                    })

                    return
                }

                if (file.type.startsWith('image/')) {
                    const { wallpapers } = await chrome.storage.local.get('wallpapers')

                    wallpapers[index].url = reader.result

                    wallpaper.cache(wallpapers)

                    chrome.storage.local.set({
                        wallpapers,
                        [`wallpaper_videos_${index}`]: '',
                    })

                    const item = target.parentElement
                    item.style.backgroundImage = `url(${reader.result})`

                    return
                }

                alert('Only accept image or video')
            })

            reader.readAsDataURL(file)
        },
        { once: true },
    )

    input.click()
})

export default setting
