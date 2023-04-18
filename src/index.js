import './prototype'
import './wallpaper'
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

noter.boot()
bookmark.boot()
emitter.click()

storage.config = storage.config || {
    log_level: 'debug',
}

logger.log_level = storage.config.log_level
window.switch_workspace_btn.innerHTML = storage.workspace || 0
