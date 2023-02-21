import logger from './logger'
import event from './event'

const WATCH_EVENT = 'change'

const store = {
    state: {},
    subs: [],
}

const handler = {}

handler.get = (target, key) => {
    if (key === 'origin') {
        return target
    }

    return target.state[key]
}

/**
 * Execute when set store property
 * The set method should return a boolean value.
 * Return true to indicate that assignment succeeded.
 * If the set method returns false, and the assignment happened in strict-mode code, a TypeError will be thrown.
 * @param value
 *  - string: auto detect target view
 *  - object: option: {
 *              value: string
 *              ta: string - target attribite
 *            }
 */
handler.set = (target, key, value) => {
    let option = {}

    if (typeof value === 'object') {
        if (value.value !== undefined) {
            option = value
            value = value.value
        } else {
            return logger.error('store: complex value invalid, { value, ta (target attribute), ... }')
        }
    }

    // render change
    {
        const bindDoms = document.querySelectorAll(`[store-bind="${key}"]`).toArray()
        bindDoms.forEach(dom => {
            const tagName = dom.tagName

            if (option.ta) {
                if (option.ta === 'innerHTML') {
                    dom.innerHTML = value
                } else if (option.ta === 'outerHTML') {
                    dom.outerHTML = value
                } else {
                    dom.setAttribute(option.ta, value)
                }
            } else if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(tagName) !== -1) {
                if (dom.type === 'checkbox' || dom.type === 'radio') {
                    dom.checked = value
                } else {
                    dom.value = value
                }
            } else if (tagName === 'IMG') {
                dom.src = value
            } else {
                dom.innerHTML = value
            }
        })
    }

    // update store state
    target.state[key] = value

    // emit event
    event.emit('store_setted', { key, value, ...option })

    return true
}


/**
 * execute when datasource change 
 */
const subHandle = ({ target }) => {
    const key = target.getAttribute('store-bind')
    let value = null

    if (target.type === 'checkbox' || target.type === 'radio') {
        value = target.checked
    } else {
        value = target.value
    }

    handler.set(store, key, value)
}

store.set = (key, value) => {
    handler.set(store, key, value)
}

store.get = (key) => {
    handler.set(store, key)
}

/**
 * option:
 *  - loadValue: add store state when watch
 */
store.watch = (option={loadValue: true}) => {
    if (store.subs.length !== 0) {
        store.subs.forEach(sub => {
            sub.removeEventListener(WATCH_EVENT, subHandle)
        })
    }

    const inputs = document.querySelectorAll('input[store-bind], textarea[store-bind], select[store-bind]').toArray()

    inputs.forEach(input => {
        store.subs.push(input)
        input.addEventListener(WATCH_EVENT, subHandle)

        if (option.loadValue) {
            subHandle({ target: input })
        }
    })
}

export default new Proxy(store, handler)
