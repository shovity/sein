# Noter Module Documentation

## Overview

The Noter module is a core component of the Chrome extension that manages sticky notes functionality. It handles note creation, rendering, synchronization, and persistence.

## Core Features

- Note management (create, update, delete)
- Workspace organization
- Real-time synchronization
- Local storage persistence
- Drag-and-drop functionality
- Note styling and formatting

## API Reference

### Properties

#### `pull_cooldown`

- Type: `number`
- Default: `10000`
- Description: Cooldown period in milliseconds between pull operations

#### `call`

- Type: `object`
- Contains throttled/debounced functions:
  - `move`: RAF-throttled function
  - `sync`: Throttled function
  - `push`: Debounced function (1000ms)

#### `version`

- Type: `number`
- Description: Current version of notes data

#### `eqCodeReady`

- Type: `boolean`
- Description: State for equation code handling

#### `notes`

- Type: `Array<Note>`
- Description: Array of note objects

### Methods

#### `fetch()`

- Returns: `Promise<void>`
- Description: Fetches notes from local storage and updates the UI

#### `save()`

- Description: Saves current notes to local storage and triggers sync

#### `createObject(note)`

- Parameters:
  - `note`: `Object` - Note data to merge with defaults
- Returns: `Object` - Complete note object with defaults
- Description: Creates a new note object with default properties

#### `createElement(note)`

- Parameters:
  - `note`: `Object` - Note data
- Returns: `HTMLElement` - DOM element for the note
- Description: Creates DOM element for a note

#### `add(note)`

- Parameters:
  - `note`: `Object` - Note to add
- Description: Adds a new note to the collection and renders it

#### `render(clear = true, workspace = +storage.workspace || 0)`

- Parameters:
  - `clear`: `boolean` - Whether to clear existing notes
  - `workspace`: `number` - Workspace ID to render
- Description: Renders notes for the specified workspace

#### `handleEqcode(editor)`

- Parameters:
  - `editor`: `HTMLElement` - Note editor element
- Description: Handles equation code insertion in notes

#### `handleHashtag(dom)`

- Parameters:
  - `dom`: `HTMLElement` - Note DOM element
- Description: Processes hashtags in note content

#### `remove(id)`

- Parameters:
  - `id`: `string` - Note ID to remove
- Description: Removes a note (moves to trash if not empty)

#### `mark(id, status)`

- Parameters:
  - `id`: `string` - Note ID
  - `status`: `string` - New status
- Description: Updates note status (default, primary, success, danger)

#### `handleOnChange({ target, key })`

- Parameters:
  - `target`: `HTMLElement` - Changed element
  - `key`: `string` - Key that triggered change
- Description: Handles note content changes

#### `pull()`

- Returns: `Promise<void>`
- Description: Pulls updates from sync server

#### `push()`

- Returns: `Promise<void>`
- Description: Pushes local changes to sync server

#### `clearTrash()`

- Description: Cleans up notes in trash older than 30 days

#### `boot()`

- Description: Initializes the noter module and sets up event listeners

## Note Object Structure

```typescript
interface Note {
  id: string
  msg: string
  x: number
  y: number
  w: number
  h: number
  workspace: number
  status: 'default' | 'primary' | 'success' | 'danger'
  updatedAt?: number
  removeAt?: number
}
```

## Event Handling

The module listens for the following events:

- `note_remove`: Removes a note
- `note_mark`: Changes note status
- `mousedown`: Initiates note movement/resize
- `mousemove`: Handles note dragging
- `mouseup`: Completes note movement/resize
- `keyup`: Handles note content changes
- `paste`: Handles pasted content
- `click`: Handles image clicks

## Storage Integration

- Uses `chrome.storage.local` for persistence
- Implements cross-tab synchronization
- Maintains version tracking for sync operations

## Dependencies

- `storage`: Core storage module
- `logger`: Logging utility
- `event`: Event handling system
- `util`: Utility functions
- `modal`: Modal dialog system

## Usage Example

```javascript
// Initialize noter
noter.boot()

// Create a new note
noter.add({
  msg: 'Hello World',
  x: 100,
  y: 100,
})

// Save changes
noter.save()
```

## Best Practices

1. Always call `save()` after modifying notes
2. Use `createObject()` for new notes to ensure proper defaults
3. Handle workspace switching through the event system
4. Implement proper error handling for sync operations
5. Consider performance when dealing with large numbers of notes
