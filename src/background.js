const holder = {
    bookmarksCache: null,
    notesCache: null,
}

const notifiBookmarkUpdated = (port, type) => {
    chrome.bookmarks.getTree((bookmarkNodes) => {
        holder.bookmarksCache = bookmarkNodes

        chrome.topSites.get((mostVisitedUrls) => {
            port.postMessage({ request: 'get_mostsite', data: mostVisitedUrls })
        })
    })
}

const notifiNotesUpdated = sender => {
    chrome.tabs.query({}, tabs => {
        const message = { request: 'note_updated', sender }

        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, message)
        })
    })
}

chrome.runtime.onConnect.addListener((port) => {
    
    // only service port name "pip"
    if (port.name !== 'pip') return
    
    // listen update bookmark
    chrome.bookmarks.onCreated.addListener(() => notifiBookmarkUpdated(port, 'created'))
    chrome.bookmarks.onRemoved.addListener(() => notifiBookmarkUpdated(port, 'removed'))
    chrome.bookmarks.onChanged.addListener(() => notifiBookmarkUpdated(port, 'changed'))
    chrome.bookmarks.onMoved.addListener(()   => notifiBookmarkUpdated(port, 'moved'))
    
    // listen mesg from newtab page
    port.onMessage.addListener(function(msg) {
        switch (msg.request) {
            
            case 'are_you_ready':
                // check background script ready
                port.postMessage({ request: msg.request, data: true })
                break
            
            case 'get_bookmark':
                // get bookmarks recent
                if (holder.bookmarksCache) {
                    port.postMessage({ request: msg.request, data: holder.bookmarksCache })
                } else {
                    chrome.bookmarks.getTree((bookmarkNodes) => {
                        holder.bookmarksCache = bookmarkNodes
                        port.postMessage({ request: msg.request, data: bookmarkNodes })
                    })
                }
            break
            
            case 'get_mostsite':
                // get most sites visited
                chrome.topSites.get((mostVisitedUrls) => {
                    port.postMessage({ request: msg.request, data: mostVisitedUrls })
                })
                break
            
            case 'post_notes':
                // write notes to storage
                chrome.storage.local.set({ 'notes': msg.data }, () => {
                    holder.notesCache.notes = msg.data
                    notifiNotesUpdated(msg.sender)
                })
                break
            
            case 'get_notes':
                // get notes
                if (holder.notesCache) {
                    port.postMessage({ request: msg.request, data: holder.notesCache })
                } else {
                    chrome.storage.local.get('notes', (data) => {
                        holder.notesCache = data
                        port.postMessage({ request: msg.request, data })
                    })
                }
                break
            
            default:
                port.postMessage({ err: 'request not macth' })
        }
    })
})