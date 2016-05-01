import "../extension/build/javascript-breakpoint-collection"
import debugObj, {updateDebugIdCallback} from "../breakpoints/debugObj"

describe("debugObj", function(){
    it("When debugging a function it passes the call arguments and value of `this` into the hook function", function(){
        var obj = {
            sayHi: function(){}
        };
        var fn = jasmine.createSpy();
        debugObj(obj, "sayHi", {
            propertyCallBefore: {
                fn: fn
            }
        })
        obj.sayHi(1,2,3)
        expect(fn.calls.mostRecent().args[0].callArguments).toEqual([1,2,3])
        expect(fn.calls.mostRecent().args[0].thisArgument).toBe(obj)

    });
    it("Lets you provide additional data to be passed into the hook function", function(){
        var obj = {
            sayHi: function(){}
        }
        var fn = jasmine.createSpy();
        debugObj(obj, "sayHi", {
            propertyCallBefore: {
                fn: fn,
                data: {
                    message: "test"
                }
            }
        })

        obj.sayHi();
        expect(fn.calls.mostRecent().args[0].data.message).toEqual("test");
    })

    it("Throws an exception if the property that should be debugged doesn't exist", function(){
        var obj = {};
        expect(function(){
            debugObj(obj, "hi", {});
        }).toThrowError("Are you sure the property \"hi\" exists?");
    })
});

describe("updateDebugIdCallback", function(){
    it("Preserves data after updating a callback", function(){
        var obj = {hello: "world"}
        var fn = jasmine.createSpy();
        var id = debugObj(obj, "hello", {
            propertyGetBefore: {fn: fn, data: "test" }
        });

        var fn2 = jasmine.createSpy();
        updateDebugIdCallback(id, fn2)

        obj.hello
        expect(fn).not.toHaveBeenCalled();
        expect(fn2).toHaveBeenCalled();
        expect(fn2.calls.mostRecent().args[0].data).toBe("test");
    })
})
