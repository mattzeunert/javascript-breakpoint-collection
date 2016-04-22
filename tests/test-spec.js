import "../extension/javascript-breakpoint-collection"

describe("debugPropertyGet", function(){
    it("Calls a callback before a property is read", function(){
        var obj = {hi: "there"};
        var fn = jasmine.createSpy();
        breakpoints.debugPropertyGet(obj, "hi", fn)
        var hi = obj.hi;
        expect(fn).toHaveBeenCalled();
    })

    it("Can show a trace message when a property is read", function(){
        var obj = {hi: "there"};
        var trace = spyOn(console, "trace")
        breakpoints.debugPropertyGet(obj, "hi", "trace");
        var hi = obj.hi;
        expect(trace).toHaveBeenCalled();
        expect(trace.calls.mostRecent().args[0]).toEqual("About to get property 'hi' on this object: ");
    });
})

describe("debugPropertySet", function(){
    it("Calls a callback when an object property is set", function(){
        var obj = {hi: "there"};
        var fn = jasmine.createSpy();
        breakpoints.debugPropertySet(obj, "hi", fn);
        obj.hi = "hello"
        expect(fn).toHaveBeenCalled();
    })
});

describe("debugPropertyCall", function(){
    it("Calls a callback when an object property containing a function is called", function(){
        var obj = {
            sayHello: function(){
                var hi = "hello";
            }
        }
        var fn = jasmine.createSpy();
        breakpoints.debugPropertyCall(obj, "sayHello", fn);
        obj.sayHello();
        expect(fn).toHaveBeenCalled();
    })
})