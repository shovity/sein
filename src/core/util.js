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

        instance.lock = true
        instance.handle(...args)
        instance.handle = null

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

util.raf = () => {
    const instance = {
        lock: false,
        handle: null,
    }

    instance.execute = (handle, ...args) => {
        instance.handle = handle

        if (instance.lock) {
            return
        }

        instance.lock = true

        window.requestAnimationFrame(() => {
            instance.lock = false
            instance.handle(...args)
        })
    }

    return instance
}

export default util
