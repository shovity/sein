import logger from './logger'

const util = {}

util.throttle = (wait = 200, trailling = true) => {
    const instance = {
        lock: false,
        handle: null,
    }

    instance.execute = (handle, ...args) => {
        instance.handle = handle

        if (instance.lock) {
            return
        }

        instance.handle(...args)
        instance.handle = null
        instance.lock = true

        setTimeout(() => {
            instance.lock = false

            if (trailling && instance.handle) {
                instance.execute(instance.handle, ...args)
            }
        }, wait)
    }

    return instance
}

util.debounce = (wait = 200) => {
    const instance = {
        timeout: null,
    }

    instance.execute = (handle, ...args) => {
        clearTimeout(instance.timeout)
        instance.timeout = setTimeout(handle, wait, ...args)
    }

    return instance
}

export default util
