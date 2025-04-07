import storage from './core/storage'
import logger from './core/logger'
import event from './core/event'
import util from './core/util'
import modal from './modal'

const noter = {
  pull_cooldown: 10000,

  call: {
    move: util.raf(),
    sync: util.throttle(),
    push: util.debounce(1000),
  },

  version: null,
  eqCodeReady: null,
  notes: [],
}

noter.fetch = async () => {
  const local = await chrome.storage.local.get(['notes', 'version'])

  noter.notes = local.notes || []
  noter.version = local.version
  noter.render()
}

noter.save = () => {
  const version = Date.now()

  chrome.storage.local.set({
    notes: noter.notes,
    version,
  })

  noter.version = version
  noter.call.push.execute(noter.push)

  logger.debug('noter: Noter save:', noter.notes)
}

noter.createObject = (note) => {
  const defaultData = {
    msg: '',
    x: Math.floor(Math.random() * (holder.w_w - 500)),
    y: Math.floor(Math.random() * (holder.w_h - 250)),
    w: 300,
    h: 100,
    workspace: storage.workspace || 0,
    status: 'default',
  }

  return Object.assign(defaultData, note)
}

noter.createElement = (note) => {
  const dom = document.createElement('div')

  dom.setAttribute('id', `noteid_${note.id}`)
  dom.setAttribute('class', 'note')
  dom.setAttribute('style', `transform: translate(${note.x}px, ${note.y}px)`)
  dom.setAttribute('note-status', note.status || 'default')

  dom.innerHTML = `
    <div class="note-controls" note-move-id="${note.id}">
        <div class="note-remove" click-emit="note_remove:${note.id}">&times;</div>
    </div>
    <div class="note-rainbow">
        <div click-emit="note_mark:${note.id},primary"></div>
        <div click-emit="note_mark:${note.id},success"></div>
        <div click-emit="note_mark:${note.id},danger"></div>
    </div>
    <div class="note-editor"
        contenteditable="true"
        spellcheck="false"
        note-editor-id="${note.id}"
        style="width:${note.w}px;height:${note.h - 20}px"
    >${note.msg}</div>`

  noter.handleHashtag(dom)

  return dom
}

noter.add = (note) => {
  // New note don't have a id, push it to noter.notes
  if (note.id === undefined) {
    note.id = Date.now().toString()
    note.updatedAt = Date.now()
    noter.notes.push(note)
  }

  // Render html
  window.note_box.appendChild(noter.createElement(note))
}

noter.render = (clear = true, workspace = +storage.workspace || 0) => {
  // Clear before render
  if (clear) {
    window.note_box.innerHTML = ''
  }

  // Loop adding
  for (const note of noter.notes) {
    if (workspace === note.workspace) {
      noter.add(note)
    }
  }

  logger.debug('noter: Render note', noter.notes)
}

noter.handleEqcode = (editor) => {
  // Insert marker
  const sel = window.getSelection()
  const range = sel.getRangeAt(0)
  const markerEl = document.createElement('span')
  markerEl.id = 'caret-marker'
  markerEl.appendChild(document.createTextNode('\u200B'))
  range.insertNode(markerEl)

  const string = editor.innerHTML

  holder.code_tables.forEach((code) => {
    const cregex = new RegExp(code.code)
    const result = string.match(cregex)

    if (result) {
      // Data embedded in command code ex. 'name_(.+?)=='
      const replaces = result.slice(1)
      let codeValue = code.value

      for (const replace of replaces) {
        codeValue = codeValue.replace('$', replace)
      }

      editor.innerHTML = string.replace(cregex, codeValue)
    }
  })

  // Restore carte and remove marker
  const newMarker = document.getElementById('caret-marker')

  if (newMarker) {
    const newRange = document.createRange()
    newRange.setStartAfter(newMarker)
    newRange.collapse(true)
    newMarker.parentNode.removeChild(newMarker)
    sel.removeAllRanges()
    sel.addRange(newRange)
  }
}

noter.handleHashtag = (dom) => {
  const editor = dom.querySelector('.note-editor')
  const head = editor.innerHTML.slice(0, 256)

  const hashtags = head.match(/#[a-z0-9_]{1,12}/gi) || []
  const classes = ['note']

  if (hashtags.includes('#mono')) {
    classes.push('note-ffm')
  }

  dom.className = classes.join(' ')
}

noter.remove = (id) => {
  const index = noter.notes.findIndex((note) => note.id == id)

  if (storage.workspace === -1 || !noter.notes[index].msg) {
    noter.notes.splice(index, 1)
  } else {
    noter.notes[index].workspace = -1
    noter.notes[index].removeAt = Date.now()
    noter.notes[index].updatedAt = Date.now()
  }

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

noter.handleOnChange = ({ target, key }) => {
  const id = target.getAttribute('note-editor-id')

  if (id) {
    const index = noter.notes.findIndex((note) => note.id == id)

    // Check changed
    if (noter.notes[index].msg === target.innerHTML) {
      return
    }

    // Handle note hashtag
    noter.handleHashtag(target.parentElement)

    // Handle note code
    if (key === '=') {
      if (noter.eqCodeReady) {
        noter.handleEqcode(target)
        noter.eqCodeReady = false
      } else {
        noter.eqCodeReady = true
      }
    }

    noter.notes[index].msg = target.innerHTML
    noter.notes[index].updatedAt = Date.now()

    noter.save()
  }
}

noter.pull = async () => {
  if (!storage.config.sync_url) {
    return
  }

  if (storage.pull_date > Date.now() - noter.pull_cooldown) {
    return
  }

  const [url, secret] = storage.config.sync_url.split('#')

  const now = Date.now()

  const response = await fetch(`${url}?date=${storage.pull_date || 0}`, {
    method: 'GET',
    headers: {
      'X-Secret': secret,
    },
  })

  const { data } = await response.json()

  if (data?.length) {
    const map = {}
    let shouldRender = false

    for (const note of noter.notes) {
      map[note.id] = note
    }

    for (const { raw: note } of data) {
      if (!map[note.id]?.updatedAt || map[note.id].updatedAt < note.updatedAt) {
        map[note.id] = note
        shouldRender = true
      }
    }

    if (shouldRender) {
      noter.notes = Object.values(map)
      noter.render()
      noter.save()
    }
  }

  storage.pull_date = now
}

noter.push = async () => {
  if (!storage.config.sync_url) {
    return
  }

  const notes = noter.notes.filter((note) => {
    return +note.updatedAt > (+storage.push_date || 0) && note.msg
  })

  const now = Date.now()
  const [url, secret] = storage.config.sync_url.split('#')

  if (notes.length) {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ notes }),
      headers: {
        'Content-Type': 'application/json',
        'X-Secret': secret,
      },
    })
  }

  storage.push_date = now
}

noter.clearTrash = () => {
  if (storage.last_clear_trash > Date.now() - 8e7) {
    return
  }

  storage.last_clear_trash = Date.now()

  noter.notes = noter.notes.filter((note) => {
    if (note.workspace !== -1) {
      return true
    }

    if (note.removeAt > Date.now() - 864e5 * 30) {
      return true
    }
  })

  noter.save()
}

noter.boot = () => {
  const state = {
    resize: false,
    move: false,
    deltaX: 0,
    deltaY: 0,
  }

  event.on('note_remove', (id) => {
    noter.remove(id)
  })

  event.on('note_mark', (mark) => {
    const [id, status] = mark.split(',')
    noter.mark(id, status)
  })

  // Handle move
  window.note_box.addEventListener('mousedown', (event) => {
    // Prevent right mouse
    if (event.which === 3) {
      return
    }

    const { target } = event

    // Detect resize
    if (target.getAttribute('note-editor-id') !== null) {
      const cx = event.clientX
      const cy = event.clientY
      const noteId = +target.getAttribute('note-editor-id')
      const noteIndex = noter.notes.findIndex((note) => note.id == noteId)
      const note = noter.notes[noteIndex]

      // Detect mouse down over resize btn
      if (note.x + note.w - cx < 15 && note.y + note.h - cy < 15) {
        state.resize = noteId
      }
    }

    if (target.getAttribute('note-move-id') !== null) {
      const noteId = +target.getAttribute('note-move-id')
      const noteIndex = noter.notes.findIndex((note) => note.id == noteId)

      // Fix position mouse vs note
      state.deltaX = event.clientX - noter.notes[noteIndex].x
      state.deltaY = event.clientY - noter.notes[noteIndex].y

      // Start move handle
      state.move = noteId
    }
  })

  window.addEventListener('mousemove', (event) => {
    if (state.move === false) {
      return
    }

    event.preventDefault()

    noter.call.move.execute(() => {
      const dom = window[`noteid_${state.move}`]

      if (dom) {
        const x = Math.min(holder.w_w - 20, Math.max(event.clientX - state.deltaX, 0))
        const y = Math.min(holder.w_h - 20, Math.max(event.clientY - state.deltaY, 0))
        dom.style.transform = `translate(${x}px, ${y}px)`
      }
    })
  })

  window.addEventListener('mouseup', (event) => {
    if (state.move !== false) {
      const x = event.clientX - state.deltaX
      const y = event.clientY - state.deltaY
      const note = noter.notes.find((e) => e.id == state.move)

      if (note) {
        note.x = Math.max(0, Math.min(holder.w_w, x))
        note.y = Math.max(0, Math.min(holder.w_h, y))
        note.updatedAt = Date.now()
      }

      // End move handle
      state.move = false

      // Save when done move a note
      noter.save()
    } else if (state.resize !== false) {
      const note = noter.notes.find((e) => e.id == state.resize)

      if (note) {
        note.w = window['noteid_' + state.resize].offsetWidth
        note.h = window['noteid_' + state.resize].offsetHeight
      }

      // End resize handle
      state.resize = false

      // Save when done move a note
      noter.save()
    }
  })

  window.note_box.addEventListener('keyup', noter.handleOnChange)
  window.note_box.addEventListener('paste', noter.handleOnChange)

  window.note_box.addEventListener('click', ({ target }) => {
    if (target.tagName === 'IMG') {
      modal.show(`<img src="${target.src}" style="max-width: calc(100vw - 50px)">`)
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

    if (workspace > storage.config.number_of_workspace - 2) {
      workspace = -1
    } else {
      workspace++
    }

    window.switch_workspace_btn.innerHTML = workspace === -1 ? '🗑️' : workspace
    storage.workspace = workspace

    noter.save()
    noter.render()
  })

  // Listen sync notes cross tab
  chrome.storage.onChanged.addListener((change, namespace) => {
    if (namespace !== 'local') {
      return
    }

    noter.call.sync.execute(() => {
      if (change.notes && change.version?.newValue > noter.version) {
        noter.notes = change.notes.newValue
        noter.render()
      }
    })
  })

  noter.fetch().then(async () => {
    noter.clearTrash()
    await noter.push()
    await noter.pull()
  })
}

export default noter
