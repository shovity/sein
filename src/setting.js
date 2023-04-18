import storage from './core/storage'
import event from './core/event'
import noter from './noter'

const PLACEHOLDER_IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2M4c+bMfwAIMANkq3cY2wAAAABJRU5ErkJggg'
const EXTEND_WALLPAPER_SIZE = 5

const setting = {
    isOpen: false,
    blob_buffer_url: null,
}

setting.render = () => {
    // Render wallpaper
    const walW = window.settings_wallpapers.clientWidth / 6 - 10
    const walH = (walW * holder.w_h) / holder.w_w

    if (storage.wallpapers.length === 3) {
        // Add placeholder for edit
        storage.wallpapers = [
            ...storage.wallpapers,
            ...new Array(EXTEND_WALLPAPER_SIZE).fill({ url: PLACEHOLDER_IMG_SRC }),
        ]
    }

    window.settings_wallpapers.innerHTML = storage.wallpapers
        .map((wall, index) => {
            let className = 'settings-wall-pre'
            if (wall.active) {
                className += ' active'
            }

            let inner = ''

            if (index >= 3) {
                inner += `<span click-emit="setting_wallpaper_edit:${index}">EDIT</span>`
            }

            return `
            <div
                class="${className}"
                style="width: ${walW}px; height: ${walH}px; background-image: url(${wall.url})"
                click-emit="setting_wallpaper_toggle:${index}"
            >${inner}</div>
            `
        })
        .join('')

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

event.on('setting_backup', () => {
    const now = new Date()

    const data = {}
    data.notes = noter.notes
    data.storage = JSON.parse(JSON.stringify(window.localStorage))

    const jsonStringData = JSON.stringify(data)

    const blob = new Blob([jsonStringData], { type: 'text/plain' })

    // Try collect buffer memory
    if (setting.blob_buffer_url !== null) {
        window.URL.revokeObjectURL(setting.blob_buffer_url)
    }

    setting.blob_buffer_url = window.URL.createObjectURL(blob)

    const anc = document.createElement('a')
    anc.href = setting.blob_buffer_url
    anc.download = 'sein-backup-' + now.toLocaleDateString().replace(/\//g, '-') + '.json'
    anc.click()
})

event.on('setting_restore', () => {
    const input = document.createElement('input')
    input.type = 'file'

    input.addEventListener(
        'change',
        () => {
            const file = input.files[0]
            const reader = new FileReader()

            reader.addEventListener('load', () => {
                const backupJsonStringData = reader.result
                const backupData = JSON.parse(backupJsonStringData)
                const { notes, storage } = backupData

                noter.notes = notes
                noter.save()

                Object.keys(storage).forEach((k) => {
                    window.localStorage[k] = storage[k]
                })

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
        return window.alert('Parse config error')
    }
    window.alert('Save config success')
})

event.on('setting_wallpaper_toggle', (index, { target }) => {
    index = +index

    const wallpapers = storage.wallpapers
    const isActive = target.className.indexOf('active') !== -1

    if (isActive) {
        target.removeClass('active')
    } else {
        target.addClass('active')
    }

    wallpapers[index].active = !isActive

    storage.wallpapers = wallpapers
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

            // Check file size
            if (file.size > 1048576) {
                return window.alert('Image must be less than 1 megabytes')
            }

            reader.addEventListener('load', () => {
                const buffys = storage.wallpapers

                buffys[index].url = reader.result
                storage.wallpapers = buffys

                const item = target.parentElement
                item.style.backgroundImage = `url(${reader.result})`
            })

            reader.readAsDataURL(file)
        },
        { once: true },
    )

    input.click()
})

event.on('setting_wallpaper_reset', () => {
    storage.wallpapers = null
    window.location.reload()
})

export default setting
