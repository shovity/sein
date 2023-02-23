import storage from './core/storage'
import logger from './core/logger'
import event from './core/event'

const noter = {
    notes: [],
    MAX_NOTE_NUMBER: 300,
    MAX_NOTE_CHARACTER: 3000,
}

noter.fetch = () => {
    chrome.storage.local.get('notes').then(({ notes }) => {
        noter.notes = notes
        noter.render()
    })
}

noter.save = () => {
    logger.debug('noter save:', noter.notes)
    chrome.storage.local.set({ notes: noter.notes })
}

noter.createObject = (note) => {
    const defaultData = {
        msg: '',
        x: Math.floor(Math.random() * (holder.w_w - 500)),
        y: Math.floor(Math.random() * (holder.w_h - 250)),
        w: 300,
        h: 100,
        workspace: storage.workspace,
        status: 'default',
    }

    return Object.assign(defaultData, note)
}

noter.createElement = (note) => {
    const { id, msg, x, y, w, h, status } = note
    const dom = document.createElement('div')

    dom.setAttribute('id', `noteid_${id}`)
    dom.setAttribute('class', 'note')
    dom.setAttribute('style', `transform: translate(${x}px, ${y}px)`)
    dom.setAttribute('note-status', status || 'default')

    dom.innerHTML = `
    <div class="box">
        <div class="note-controls" move-noteid="${id}">
            <div class="note-remove" remove-noteid="${id}">&times;</div>
        </div>
        <div class="rain-bow">
            <div mark="${id}:primary"></div>
            <div mark="${id}:success"></div>
            <div mark="${id}:danger"></div>
        </div>
        <textarea
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            editor-noteid="${id}"
            style="width:${w}px;height:${h - 20}px;"
        >${msg}</textarea>
    </div>`

    return dom
}

noter.add = (note) => {
    if (noter.notes.length > noter.MAX_NOTE_NUMBER) {
        return window.alert('The maximum number of notes has been reached')
    }

    // New note don't have a id, push it to noter.notes
    if (note.id === undefined) {
        note.id = Date.now().toString()
        noter.notes.push(note)
    }

    logger.debug(`add note ${note.id} = ${note.msg}`)

    // Render html
    window.note_box.appendChild(noter.createElement(note))
}

noter.render = (clear = true, workspace = +storage.workspace || 0) => {
    // Clear before render
    if (clear) {
        window.note_box.innerHTML = ''
    }

    // Loop adding
    noter.notes
        .filter((note) => {
            return workspace === +note.workspace
        })
        .forEach((note) => {
            noter.add(note)
        })
}

noter.checkAndReplaceCode = (target) => {
    const string = target.value

    holder.code_tables.forEach((code) => {
        const cregex = new RegExp(code.code)

        const result = string.match(cregex)
        if (result) {
            const datas = result.slice(1)

            const oldSelectionStart = target.selectionStart
            const oldValue = target.value

            let codeValue = code.value

            datas.forEach((data) => {
                codeValue = codeValue.replace('$', data)
            })

            target.value = string.replace(cregex, codeValue)

            const newSelectionStart = oldSelectionStart + target.value.length - oldValue.length
            target.setSelectionRange(newSelectionStart, newSelectionStart)
        }
    })
}

noter.remove = (id) => {
    const index = noter.notes.findIndex((note) => note.id == id)
    noter.notes.splice(index, 1)

    // Remove dom
    const dom = window[`noteid_${id}`]
    dom.parentElement.removeChild(dom)

    noter.save()
}

noter.mark = (id, status) => {
    const note = noter.notes.find((n) => n.id == id)

    if (note.status === status) {
        note.status = 'default'
    } else {
        note.status = status
    }

    window[`noteid_${id}`].setAttribute('note-status', note.status)
    noter.save()
}

noter.boot = () => {
    let resizeId = false
    let moveId = false
    let fixX = 0
    let fixY = 0

    // Listen click note
    window.note_box.addEventListener('click', (event) => {
        const { target } = event

        const removeId = target.getAttribute('remove-noteid')
        const mark = target.getAttribute('mark')

        if (removeId) {
            noter.remove(removeId)
        } else if (mark) {
            const [noteId, status] = mark.split(':')
            noter.mark(noteId, status)
        }
    })

    // Handle move
    window.note_box.addEventListener('mousedown', (event) => {
        // Prevent right mouse
        if (event.which === 3) {
            return
        }

        const { target } = event

        // Detect resize
        if (target.getAttribute('editor-noteid') !== null) {
            const cx = event.clientX
            const cy = event.clientY
            const noteId = +target.getAttribute('editor-noteid')
            const noteIndex = noter.notes.findIndex((note) => note.id == noteId)
            const note = noter.notes[noteIndex]

            // Detect mouse down over resize btn
            if (note.x + note.w - cx < 15 && note.y + note.h - cy < 15) {
                resizeId = noteId
            }
        }

        if (target.getAttribute('move-noteid') !== null) {
            const noteId = +target.getAttribute('move-noteid')
            const noteIndex = noter.notes.findIndex((note) => note.id == noteId)

            // Fix position mouse vs note
            fixX = event.clientX - noter.notes[noteIndex].x
            fixY = event.clientY - noter.notes[noteIndex].y

            // Start move handle
            moveId = noteId
        }
    })

    window.addEventListener('mousemove', (event) => {
        if (moveId === false) return

        event.preventDefault()
        let x = event.clientX - fixX
        let y = event.clientY - fixY

        if (y < 0) {
            y = 0
        }

        if (y > holder.w_h - 20) {
            y = holder.w_h - 20
        }

        if (x < 0) {
            x = 0
        }

        if (x > holder.w_w - 20) {
            x = holder.w_w - 20
        }

        if (window[`noteid_${moveId}`]) window[`noteid_${moveId}`].style.transform = `translate(${x}px, ${y}px)`
    })

    window.addEventListener('mouseup', (event) => {
        if (moveId !== false) {
            const x = event.clientX - fixX
            const y = event.clientY - fixY
            const noteIndex = noter.notes.findIndex((note) => note.id == moveId)

            if (noteIndex !== -1) {
                noter.notes[noteIndex].x = x
                noter.notes[noteIndex].y = y
            }

            // End move handle
            moveId = false

            // Save when done move a note
            noter.save()
        } else if (resizeId !== false) {
            const index = noter.notes.findIndex((note) => note.id == resizeId)
            const w = window['noteid_' + resizeId].offsetWidth
            const h = window['noteid_' + resizeId].offsetHeight

            if (index !== -1) {
                noter.notes[index].w = w
                noter.notes[index].h = h
            }

            // End resize handle
            resizeId = false

            // Save when done move a note
            noter.save()
        }
    })

    // Handle edit notes
    // Keyup only when focus textarea
    window.note_box.addEventListener('keyup', ({ target, key }) => {
        const id = target.getAttribute('editor-noteid')

        if (id) {
            const index = noter.notes.findIndex((note) => note.id == id)

            // Handle note code
            if (key === '=') {
                noter.checkAndReplaceCode(target)
            }

            // Check max note character
            if (target.value.length > noter.MAX_NOTE_CHARACTER) {
                return window.alert('The maximum character has been reached')
            }

            noter.notes[index].msg = target.value
            noter.save()
        }
    })

    // Listen add note
    event.on('noter_add', () => {
        noter.add(noter.createObject())
        noter.save()
    })

    // Listen switch workspace
    event.on('noter_switch_workspace', () => {
        let workspace = +storage.workspace || 0

        if (workspace > 2) {
            workspace = 0
        } else {
            workspace++
        }

        window.switch_workspace_btn.innerHTML = workspace
        storage.workspace = workspace

        noter.save()
        noter.render()
    })

    // Listen sync notes cross tab
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.notes && document.hidden) {
            noter.notes = changes.notes.newValue
            noter.render()
        }
    })

    noter.fetch()
}

export default noter
