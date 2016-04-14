# @dbb/e
Pub/Sub module for Node.js

[![Build Status](https://travis-ci.org/DungBeetleBASH/e.png)](https://travis-ci.org/DungBeetleBASH/e)

## Installation

`npm install @dbb/e`

## Docs

* * *

### on(eventName, callback, context, once) 

Bind a callback to an event and an optional context

**Parameters**

**eventName**: `String`

**callback**: `Function`

**context**: `Object`, reference to the calling context

**once**: `Boolean`, If true, the callback will be removed once fired



### once(eventName, callback, context) 

Bind a callback to an event and fire it only once

**Parameters**

**eventName**: `String`

**callback**: `Function`

**context**: `Object`, reference to the calling context



### fire(eventName, arguments) 

Call all callbacks bound to an event

**Parameters**

**eventName**: `String`

**arguments**: `Mixed`, zero or more optional arguments



### remove(eventName, callback, context) 

Remove an event handler from an event

**Parameters**

**eventName**: `String`

**callback**: `Function`

**context**: `Object`, reference to the calling context



### removeAllForEvent(eventName) 

Remove all event handlers from an event
by removing the event from the eventMap.

**Parameters**

**eventName**: `String`



### removeAll() 

Removes all events and event handlers from the eventMap.



### getEvents(eventName) 

Given an eventName, returns all event handlers associated with that event.
With no event name passed, returns the whole event map.

**Parameters**

**eventName**: `String`

**Returns**: `Object | Array`



* * *
