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

  code_tables: [
    { code: 'date==', value: new Date().toLocaleDateString() },
    { code: 'time==', value: new Date().toLocaleTimeString() },
    { code: 'now==', value: new Date().toLocaleString() },
    { code: 'name_(.+?)==', value: 'Hi sir, $ <3' },
  ],
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

  window.btn_switch_workspace.innerHTML = storage.workspace
} else {
  window.btn_switch_workspace.innerHTML = '0'
}

logger.log_level = storage.config.log_level
