var e = require('../e'),
	sinon = require('sinon');

describe("@dbb/e tests", function() {

	var func1,
		func2,
		eventMap,
		ctx = {};

	beforeEach(function() {
		func1 = sinon.spy();
		func2 = sinon.spy();
		e.remove();
		eventMap = {};
		e.debug = true;
	});

	afterEach(function() {
		e.debug = false;
	});

	describe("on()", function() {
		it("Should populate the event map", function() {
			e.on("someEvent", func1);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].callback).toBe(func1);
		});
		it("Should populate the event map with a given context", function() {
			e.on("someEvent", func1, ctx);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].context).toBe(ctx);
		});
		it("Should populate the event map with a one time callback", function() {
			e.on("someEvent", func1, null, true);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].once).toBe(true);
		});
		it("Should not add a duplicate", function() {
			e.on("someEvent", func1);
			e.on("someEvent", func1);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
		});
	});

	describe("once()", function() {
		it("Should populate the event map with a one time callback", function() {
			e.once("someEvent", func1);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].once).toBe(true);
		});
		it("Should populate the event map with a given context", function() {
			e.once("someEvent", func1, ctx);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].context).toBe(ctx);
		});
		it("Should remove the callback from the event map after it is fired and remove the event", function() {
			e.once("someEvent", func1);
			e.on("someOtherEvent", func2);
			e.fire("someEvent");
			eventMap = e.getEvents();
			expect(func1.calledOnce).toBe(true);
			expect(func2.called).toBe(false);
			expect(eventMap["someEvent"]).toBe(undefined);
			expect(eventMap["someOtherEvent"].length).toBe(1);
			expect(eventMap["someOtherEvent"][0].callback).toBe(func2);
		});
		it("Should remove the callback from the event map after it is fired and keep the event", function() {
			e.once("someEvent", func1);
			e.on("someEvent", func2);
			e.fire("someEvent");
			e.fire("someEvent");
			eventMap = e.getEvents();
			expect(func1.calledOnce).toBe(true);
			expect(func2.calledTwice).toBe(true);
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].callback).toBe(func2);
		});
		it("Should call the registered function on a given context", function() {
			var ctx = {
					callCount: 0
				},
				updateCallCount = function () {
					this.callCount++;
				};
			e.once("someEvent", updateCallCount, ctx);
			e.fire("someEvent");
			e.fire("someEvent");
			e.fire("someEvent");
			expect(ctx.callCount).toBe(1);
		});
	});

	describe("fire()", function() {
		it("Should call the registered functions", function() {
			e.on("someEvent", func1);
			e.on("someEvent", func2);
			e.fire("someEvent");
			eventMap = e.getEvents();
			expect(func1.calledOnce).toBe(true);
			expect(func2.calledOnce).toBe(true);
		});
		it("Should call the registered function with one argument", function() {
			var arg = {};
			e.on("someEvent", func1);
			e.fire("someEvent", arg);
			eventMap = e.getEvents();
			expect(func1.getCall(0).args[0]).toBe(arg);
		});
		it("Should call the registered function with one argument", function() {
			var arg = {},
				arg2 = {};
			e.on("someEvent", func1);
			e.fire("someEvent", arg, arg2);
			eventMap = e.getEvents();
			expect(func1.getCall(0).args[0]).toBe(arg);
			expect(func1.getCall(0).args[1]).toBe(arg2);
		});
		it("Should call the registered function on a given context", function() {
			var ctx = {
					callCount: 0
				},
				updateCallCount = function () {
					this.callCount++;
				};
			e.on("someEvent", updateCallCount, ctx);
			e.fire("someEvent");
			e.fire("someEvent");
			e.fire("someEvent");
			expect(ctx.callCount).toBe(3);
		});
	});

	describe("remove()", function() {
		it("Should remove all events and event handlers", function() {
			e.on("someEvent", func1);
			e.on("someEvent", func2);
			e.remove();
			eventMap = e.getEvents();
			expect(eventMap["someEvent"]).toBe(undefined);
		});
		it("Should remove all events and event handlers", function() {
			e.on("someEvent", func1);
			e.remove("someEvent");
			eventMap = e.getEvents();
			expect(eventMap["someEvent"]).toBe(undefined);
		});
		it("Should remove only one event handler", function() {
			e.on("someEvent", func1);
			e.on("someEvent", func2);
			e.remove("someEvent", func1);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].callback).toBe(func2);
		});
		it("Should remove only one event handler with a matching context", function() {
			var ctx = {},
				ctx2 = {};
			e.on("someEvent", func1, ctx);
			e.on("someEvent", func1, ctx2);
			e.remove("someEvent", func1, ctx);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].callback).toBe(func1);
			expect(eventMap["someEvent"][0].context).toBe(ctx2);
		});
		it("Should remove only one event handler with no context", function() {
			var ctx = {};
			e.on("someEvent", func1, ctx);
			e.on("someEvent", func1);
			e.remove("someEvent", func1);
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].callback).toBe(func1);
			expect(eventMap["someEvent"][0].context).toBe(ctx);
		});
	});

	describe("Firing non-existent events", function() {
		function fireEvent() { 
			e.fire("someEvent");
		}
		it("Should not result in an error if the event does not exist", function() {
			expect(fireEvent).not.toThrow("TypeError: expect(...).not.toThrowError is not a function");
		});
		it("Should not result in an error if the event is removed by an event handler", function() {
			function removeEvent() {
				e.remove("someEvent", removeEvent);
			}

			e.on("someEvent", removeEvent);
			expect(fireEvent).not.toThrow("TypeError: expect(...).not.toThrowError is not a function");
		});
	});

	describe("getEvents()", function() {
		it("Should return an empty object", function() {
			e.on("someEvent", func1);
			e.debug = false;
			eventMap = e.getEvents();
			expect(eventMap["someEvent"]).toBe(undefined);
			expect(e.debug).toBe(false);
		});
		it("Should return an empty array", function() {
			e.on("someEvent", func1);
			e.debug = false;
			eventMap = e.getEvents("someEvent");
			expect(Array.isArray(eventMap)).toBe(true);
			expect(eventMap.length).toBe(0);
			expect(e.debug).toBe(false);
		});
		it("Should return an event map", function() {
			e.on("someEvent", func1);
			e.debug = true;
			eventMap = e.getEvents();
			expect(eventMap["someEvent"].length).toBe(1);
			expect(eventMap["someEvent"][0].callback).toBe(func1);
			expect(e.debug).toBe(true);
		});
	});

});
