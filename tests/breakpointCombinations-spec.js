import breakpointCombinations from "../breakpoints/breakpointCombinations"

describe("breakpointCombinations", function(){
    it("Can register a breakpiontCombination that breaks in multiple situations", function(){
        var obj = {hello: "world"}
        var propertyGetCallback = jasmine.createSpy();
        var propertySetCallback = jasmine.createSpy();
        var fn = function(debugPropertyGet, debugPropertySet, debugPropertyCall){
            debugPropertyGet(obj, "hello", propertyGetCallback);
            debugPropertySet(obj, "hello", propertySetCallback);
        }
        breakpointCombinations.register(fn, {});

        obj.hello;
        expect(propertyGetCallback).toHaveBeenCalled();
        expect(propertySetCallback).not.toHaveBeenCalled();

        obj.hello = "hi";
        expect(propertySetCallback).toHaveBeenCalled();
    })

    it("Can disable a registerered breakpoint", function(){
        var obj = {hello: "world"};
        var callback = jasmine.createSpy();
        var fn = function(debugPropertyGet) {
            debugPropertyGet(obj, "hello", callback);
        }
        var id = breakpointCombinations.register(fn, {});
        breakpointCombinations.disable(id);
        obj.hello;
        expect(callback).not.toHaveBeenCalled();
    })
})
