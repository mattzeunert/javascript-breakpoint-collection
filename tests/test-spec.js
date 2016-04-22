import "../extension/javascript-breakpoint-collection"

describe("debugPropertyGet", function(){
    it("calls a callback before a property is read", function(){
        var obj = {hi: "there"};
        var called = false;
        var fn = jasmine.createSpy();
        breakpoints.debugPropertyGet(obj, "hi", fn)
        var hi = obj.hi;
        expect(fn).toHaveBeenCalled();
    })
})