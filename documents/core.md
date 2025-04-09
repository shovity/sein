# Core Modules Documentation

This document provides detailed information about the core modules used in the application.

## Table of Contents

- [Emitter](#emitter)
- [Event](#event)
- [Logger](#logger)
- [Storage](#storage)
- [Store](#store)
- [Util](#util)

## Emitter

The Emitter module provides a system for handling DOM events and custom event emission.

### Features

- Event generator system
- Click event handling with payload support
- DOM event delegation
- Custom event emission

### Usage

```javascript
// Generate a new emitter
emitter.gen('customEvent', () => {
  // Setup code for the emitter
})

// Using click-emit attribute in HTML
;<button click-emit="eventName:payload">Click me</button>
```

### Payload Types

- Simple string payload: `click-emit="eventName:value"`
- Object payload: `click-emit="eventName:?key1=value1&key2=value2"`

## Event

The Event module provides a simple pub/sub system for handling custom events.

### Features

- Event pooling
- Synchronous and asynchronous event emission
- Event subscription management

### Methods

- `event.emit(name, ...payload)`: Emit an event synchronously
- `event.on(name, handle)`: Subscribe to an event
- `event.next(name, ...payload)`: Emit an event asynchronously

### Usage

```javascript
// Subscribe to an event
event.on('customEvent', (payload) => {
  console.log(payload)
})

// Emit an event
event.emit('customEvent', 'data')
```

## Logger

The Logger module provides a configurable logging system with different severity levels.

### Features

- Multiple log levels (debug, info, warning, error)
- Color-coded console output
- Configurable log level
- No-op functions for disabled levels

### Log Levels

1. debug (gray)
2. info (blue)
3. warning (yellow)
4. error (red)

### Usage

```javascript
logger.debug('Debug message')
logger.info('Info message')
logger.warning('Warning message')
logger.error('Error message')

// Configure log level
logger.log_level = 'info' // Only info, warning, and error will be shown
```

## Storage

The Storage module provides a proxy-based interface to localStorage with automatic JSON serialization.

### Features

- Automatic JSON serialization/deserialization
- Proxy-based interface
- Error handling for invalid JSON

### Usage

```javascript
// Set a value
storage.key = { data: 'value' }

// Get a value
const value = storage.key

// Access raw storage
const rawStorage = storage.origin
```

## Store

The Store module provides a reactive state management system with DOM binding.

### Features

- Reactive state management
- DOM element binding
- Automatic UI updates
- Event emission on state changes
- Support for various input types

### Usage

```javascript
// Set a value
store.key = 'value'

// Set with options
store.key = {
  value: 'value',
  ta: 'innerHTML', // target attribute
}

// Get a value
const value = store.key

// Watch for changes
store.watch({ loadValue: true })
```

### DOM Binding

```html
<!-- Text content -->
<div store-bind="key"></div>

<!-- Input elements -->
<input store-bind="key" type="text" />
<input store-bind="key" type="checkbox" />
<textarea store-bind="key"></textarea>
<select store-bind="key"></select>

<!-- Image -->
<img store-bind="key" />
```

## Util

The Util module provides utility functions for common operations.

### Features

- Throttle function
- Debounce function
- RequestAnimationFrame wrapper

### Methods

#### Throttle

```javascript
const throttled = util.throttle(200, true)
throttled.execute(() => {
  // Function to throttle
})
```

#### Debounce

```javascript
const debounced = util.debounce(200)
debounced.execute(() => {
  // Function to debounce
})
```

#### RAF (RequestAnimationFrame)

```javascript
const raf = util.raf()
raf.execute(() => {
  // Function to run in next animation frame
})
```

### Parameters

- `wait`: Time in milliseconds (default: 200)
- `trailling`: Whether to execute the last call (default: true)
