import './prototype'
import './wallpaper'

import event from './core/event'
import emitter from './core/emitter'
import storage from './core/storage'
import logger from './core/logger'
import noter from './noter'
import bookmark from './bookmark'
import waver from './waver'
import setting from './setting'

window.config = storage.config || {
    log_level: 'debug',
}

window.holder = {
    w_w: window.document.documentElement.clientWidth,
    w_h: window.document.documentElement.clientHeight,

    code_tables: [
        { code: 'date==', value: new Date().toLocaleDateString() },
        { code: 'time==', value: new Date().toLocaleTimeString() },
        { code: 'now==', value: new Date().toLocaleString() },
        // { code: 'name_(.+?)', value: 'Hi sir, $ <3' },
    ],
}

window.addEventListener('resize', () => {
    holder.w_w = window.document.documentElement.clientWidth
    holder.w_h = window.document.documentElement.clientHeight
})

emitter.click()

logger.log_level = config.log_level
window.btn_switch_workspace.innerHTML = storage.workspace || 0
