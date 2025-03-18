import storage from './core/storage'

const wallpaper = {
  default: {
    wallpapers: [
      {
        url: `img/w0.jpg`,
        video: 0,
        active: true,
      },
      {
        url: `img/w1.jpg`,
        video: 1,
      },
      {
        url: `img/w2.jpg`,
        video: 2,
      },
    ],
    local: {
      wallpaper_videos_0: 'video/w0.mp4',
      wallpaper_videos_1: 'video/w1.mp4',
      wallpaper_videos_2: 'video/w2.mp4',
    },
  },
}

wallpaper.init = () => {
  const wallpapers = wallpaper.default.wallpapers

  chrome.storage.local.set({
    ...wallpaper.default.local,

    wallpapers: wallpapers.concat(
      Array(9).fill({
        url: `img/placeholder.png`,
        editbale: true,
      }),
    ),
  })

  return wallpaper.cache(wallpapers)
}

wallpaper.cache = (wallpapers) => {
  try {
    const actives = wallpapers.filter((w) => w.active)
    storage.wallpapers = actives

    return actives
  } catch (error) {
    alert('The value of wallpapers exceeded the quota')
    throw error
  }
}

wallpaper.boot = () => {
  const wallpapers = storage.wallpapers || wallpaper.init()
  const pick = wallpapers[Math.floor(Math.random() * wallpapers.length)]

  if (!pick) {
    return
  }

  window.wall.style.backgroundImage = `url(${pick.url})`

  if (pick.video > -1) {
    setTimeout(() => {
      const key = `wallpaper_videos_${pick.video}`

      chrome.storage.local.get(key, (data) => {
        const source = document.createElement('source')

        source.src = data[key]
        source.type = 'video/mp4'

        window.wall_video.appendChild(source)
      })
    })
  }
}

export default wallpaper
