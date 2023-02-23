import logger from './logger'
import event from './event'

const emitter = {}
const mounted = {}

emitter.mounted = mounted

/**
 * Emitter generator
 * @param name {string} Emitter name
 * @param handle {function} Call one time for setup emitter
 */
emitter.gen = (name, handle) => {
    if (emitter[name] || !/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(name)) {
        return logger.error(`emitter: name "${name}" existed or invalid`)
    }

    emitter[name] = () => {
        if (mounted[name]) {
            return logger.error(`emitter: duplicate mount emitter ${name}`)
        }

        handle()

        mounted[name] = true
    }
}

// Define emitter

const y = 1

emitter.gen('click', () => {
    const x = 1

    function handleClickR(target, domEvent, up = 0) {
        if (up > 5 || !target) {
            return
        }

        console.log(x, y)

        const clickEmit = target.getAttribute('click-emit')

        if (!clickEmit) {
            return handleClickR(target.parentElement, domEvent, up + 1)
        }

        const name = clickEmit.split(':')[0]

        let payload = clickEmit.split(':').slice(1).join(':')

        // handle object payload
        if (payload[0] === '?') {
            const payloadObject = {}
            payload
                .slice(1)
                .split('&')
                .forEach((q) => {
                    const [key, value] = q.split('=')
                    if (key === '') {
                        return
                    }
                    payloadObject[key] = value
                })
            payload = payloadObject
        }

        event.next(name, payload, { target, domEvent })
    }

    window.document.body.addEventListener('click', (domEvent) => {
        handleClickR(domEvent.target, domEvent)
    })

    logger.info('emiter: click emiter mounted')
})

export default emitter
