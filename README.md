# @dbb/e
Pub/Sub module for Node.js

[![Build Status](https://travis-ci.org/DungBeetleBASH/e.png)](https://travis-ci.org/DungBeetleBASH/e) 
[![npm version](https://badge.fury.io/js/%40dbb%2Fe.png)](https://badge.fury.io/js/%40dbb%2Fe)

## Installation

`npm install @dbb/e`

## Docs

* * *

### on(eventName, callback, [context], [once]) 

Bind a callback to an event and an optional context

**Parameters**

**eventName**: `String`

**callback**: `Function`

**context**: `Object`, reference to the calling context

**once**: `Boolean`, If true, the callback will be removed once fired



### once(eventName, callback, [context]) 

Bind a callback to an event and fire it only once

**Parameters**

**eventName**: `String`

**callback**: `Function`

**context**: `Object`, reference to the calling context



### fire(eventName, [...arguments]) 

Call all callbacks bound to an event

**Parameters**

**eventName**: `String`

**arguments**: `Mixed`, zero or more optional arguments



### remove([eventName], [callback], [context]) 

Remove an event handler from an event

If no eventName is passed, remove all events and event handlers.

If an eventName but no event handlers is passed, remove all event handlers for that event and remove the event.

If an eventName and event handlers are passed, remove event handlers with matching eventName and context.

**Parameters**

**eventName**: `String`

**callback**: `Function`

**context**: `Object`, reference to the calling context



### getEvents([eventName]) 

If debug is true: given an eventName, returns all event handlers associated with that event.
With no event name passed, returns the whole event map.
If debug is false: returns an empty object or array.

**Parameters**

**eventName**: `String`

**Returns**: `Object | Array`



### debug `Boolean`

If true (or a value which evaluates to true) enable getEvents().



* * *
