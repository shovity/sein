const LEVEL = ['debug', 'info', 'warning', 'error']

const logger = {
    log_level: 'debug',

    get debug() {
        if (LEVEL.indexOf(this.log_level.toLowerCase()) <= LEVEL.indexOf('debug')) {
            return console.debug.bind(window.console, '%cDEBUG:', 'color: #6c757d')
        }

        return () => undefined
    },

    get info() {
        if (LEVEL.indexOf(this.log_level.toLowerCase()) <= LEVEL.indexOf('info')) {
            return console.info.bind(window.console, '%cINFO:', 'color: #17a2b8')
        }

        return () => undefined
    },

    get warning() {
        if (LEVEL.indexOf(this.log_level.toLowerCase()) <= LEVEL.indexOf('warning')) {
            return console.warn.bind(window.console, '%cWARNING:', 'color: #ffc107')
        }

        return () => undefined
    },

    get error() {
        if (LEVEL.indexOf(this.log_level.toLowerCase()) <= LEVEL.indexOf('error')) {
            return console.error.bind(window.error, '%cERROR:', 'color: #dc3545')
        }

        return () => undefined
    },
}

export default logger
