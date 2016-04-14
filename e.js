"use strict";
var eventMap = {};

/**
 * @method isDuplicate
 * @private
 * @param {String} eventName
 * @param {Function} callback
 * @param {Object} context reference to the calling context
 */
function isDuplicate(eventName, callback, context) {
	var isExisting = false,
		isHandlerDuplicated = function (eventHandler) {
			if (eventHandler.callback === callback && eventHandler.context === context) {
				isExisting = true;
				return true;
			}
		};

	if (!eventMap[eventName] || !eventMap[eventName].length) {
		return false;
	}

	eventMap[eventName].some(isHandlerDuplicated);

	if (isExisting) {
		return true;
	}

	return false;
}

/**
 * @method fireCallbacks
 * @private
 * @param {String} eventName
 * @param {Object} args
 */
function fireCallbacks(eventName, args) {
	eventMap[eventName].forEach(function (eventHandler) {
		eventHandler.callback.apply(eventHandler.context, args);
	});
}

/**
 * @method removeOnceCallbacks
 * @private
 * @param {String} eventName
 */
function removeOnceCallbacks(eventName) {
	eventMap[eventName] = eventMap[eventName].filter(function (eventHandler) {
		return (!eventHandler.once);
	});
}

/**
 * @method removeCallback
 * @private
 * @param {String} eventName
 * @param {Function} callback
 * @param {Object} ctx reference to the calling context
 */
function removeCallback(eventName, callback, ctx) {
	eventMap[eventName] = eventMap[eventName].filter(function (eventHandler) {
		return (eventHandler.context !== ctx || eventHandler.callback !== callback);
	});
}

module.exports = {

	/**
	 * Bind a callback to an event and an optional context
	 * @method on
	 * @public
	 * @param {String} eventName
	 * @param {Function} callback
	 * @param {Object} [context] reference to the calling context
	 * @param {Boolean} [once] If true, the callback will be removed once fired
	 */
	on: function (eventName, callback, context, once) {
		var ctx = context || this;
		if (isDuplicate(eventName, callback, ctx)) {
			return;
		}
		eventMap[eventName] = eventMap[eventName] || [];
		eventMap[eventName].push({callback: callback, context: ctx, once: once});
	},

	/**
	 * Bind a callback to an event and fire it only once
	 * @method once
	 * @public
	 * @param {String} eventName
	 * @param {Function} callback
	 * @param {Object} [context] reference to the calling context
	 */
	once: function (eventName, callback, context) {
		var ctx = context || this;
		this.on(eventName, callback, ctx, true);
	},

	/**
	 * Call all callbacks bound to an event
	 * @method fire
	 * @public
	 * @param {String} eventName
	 * @param {...*} [arguments] zero or more optional arguments
	 */
	fire: function (eventName) {
		var args = [].slice.call(arguments, 1);

		if (!eventMap[eventName]) {
			return;
		}

		fireCallbacks(eventName, args);

		removeOnceCallbacks(eventName);

		if (!eventMap[eventName].length) {
			this.removeAllForEvent(eventName);
		}
	},

	/**
	 * Remove an event handler from an event
	 * @method remove
	 * @public
	 * @param {String} eventName
	 * @param {Function} callback
	 * @param {Object} [context] reference to the calling context
	 */
	remove: function (eventName, callback, context) {
		var ctx = context || this;

		if (!eventMap[eventName]) {
			return;
		}

		removeCallback(eventName, callback, ctx);

		if (!eventMap[eventName].length) {
			this.removeAllForEvent(eventName);
		}
	},

	/**
	 * Remove all event handlers from an event
	 * by removing the event from the eventMap.
	 * @method removeAllForEvent
	 * @public
	 * @param {String} eventName
	 */
	removeAllForEvent: function (eventName) {
		if (eventMap[eventName]) {
			delete eventMap[eventName];
		}
	},

	/**
	 * Removes all events and event handlers from the eventMap.
	 * @method removeAll
	 * @public
	 */
	removeAll: function () {
		eventMap = {};
	},

	/**
	 * Given an eventName, returns all event handlers associated with that event.
	 * With no event name passed, returns the whole event map.
	 * @method getEvents
	 * @public
	 * @param {String} [eventName]
	 * @return {Object || Array}
	 */
	getEvents: function (eventName) {
		if (eventName) {
			return eventMap[eventName] || [];
		}
		return eventMap;
	}

};
