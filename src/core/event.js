import logger from './logger'

const event = {
    pool: {},
}

event.emit = (name, ...payload) => {
    for (const handle of event.pool[name] || []) {
        handle(...payload)
    }
}

event.on = (name, handle) => {
    event.pool[name]?.push(handle) || (event.pool[name] = [handle])
}

event.next = (name, ...payload) => {
    setTimeout(event.emit, 0, name, ...payload)
}

export default event
