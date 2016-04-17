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
		e.removeAll();
		eventMap = {};
	});

	afterEach(function() {
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
		// TODO: ctx
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
	});

	describe("remove()", function() {
		it("", function() {
		});
	});

	describe("removeAllForEvent()", function() {
		it("", function() {
		});
	});

	describe("removeAll()", function() {
		it("", function() {
		});
	});

	describe("getEvents()", function() {
		it("", function() {
		});
	});

});