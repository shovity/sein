const util = {}

util.createTimeoutCall = (timeout = 200, fn, ...args) => {
    const instance  = {}
    instance.timeout = timeout
    instance.fn = fn
    instance.args = args
    instance.call_timeout = null
    

    instance.execute = (fn) => {
        if (fn) {
            instance.fn = fn
        }

        if (!instance.fn) {
            return logger.error('util: createTimeoutCall: missing fn')
        }

        clearTimeout(instance.call_timeout)
        instance.call_timeout = setTimeout(() => {
            fn(...instance.args)
        }, instance.timeout)
    }

    return instance
}

export default util


