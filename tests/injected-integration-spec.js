describe("Injected script integration test", function(){
    it("Can update the type of a breakpoint", function(){
        var obj = {hello: "world"}
        spyOn(console, "trace")
        breakpoints.debugPropertyGet(obj, "hello");
        var id = breakpoints.__internal.getRegisteredBreakpoints()[0].id;
        breakpoints.__internal.updateBreakpointType(id, "trace");
        var hi = obj.hello;

        expect(console.trace.calls.mostRecent().args[0]).toBe("About to get property 'hello' on this object: ")
    })
});