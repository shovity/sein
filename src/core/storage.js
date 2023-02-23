import logger from './logger'

const storage = {}
const handler = {}

handler.get = (target, key) => {
    if (key === 'origin') {
        return target
    }

    const raw = window.localStorage[key]

    try {
        return raw && JSON.parse(raw)
    } catch (error) {
        return logger.error('storage: parse json fail, key: ', key)
    }
}

handler.set = (target, key, value) => {
    window.localStorage[key] = JSON.stringify(value)
    target[key] = value
    return true
}

export default new Proxy(storage, handler)
