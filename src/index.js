import './prototype'
import wallpaper from './wallpaper'
import emitter from './core/emitter'
import storage from './core/storage'
import logger from './core/logger'
import noter from './noter'
import bookmark from './bookmark'
import './waver'
import './setting'

window.holder = {
    w_w: window.document.documentElement.clientWidth,
    w_h: window.document.documentElement.clientHeight,
}

window.addEventListener('resize', () => {
    holder.w_w = window.document.documentElement.clientWidth
    holder.w_h = window.document.documentElement.clientHeight
})

wallpaper.boot()
noter.boot()
bookmark.boot()
emitter.click()

storage.config = Object.assign(
    {
        log_level: 'error',
        number_of_workspace: 2,
    },
    storage.config,
)

if (storage.workspace) {
    if (storage.workspace === -1) {
        storage.workspace++
    }

    window.switch_workspace_btn.innerHTML = storage.workspace
} else {
    window.switch_workspace_btn.innerHTML = '0'
}

logger.log_level = storage.config.log_level
