import storage from './core/storage'

let wallpapers = storage.wallpapers

if (!wallpapers) {
    wallpapers = [
        {
            url: `img/w1.jpg`,
            active: true,
        },
        {
            url: `img/w2.jpg`,
            active: true,
        },
        {
            url: `img/w3.jpg`,
            active: true,
        },
    ]

    storage.wallpapers = wallpapers
}

wallpapers = wallpapers.filter((w) => w.active)

const wallForShow = wallpapers[Math.floor(Math.random() * wallpapers.length)]

if (wallForShow) {
    window.wall.style.backgroundImage = `url(${wallForShow.url})`

    setTimeout(() => {
        window.wall_ghost_left.style.backgroundImage = `url(${wallForShow.url})`
        window.wall_ghost_right.style.backgroundImage = `url(${wallForShow.url})`
    }, 500)
}
