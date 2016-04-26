import "../extension/build/javascript-breakpoint-collection"
import debugObj from "../breakpoints/debugObj"

describe("debugObj", function(){
    it("When debugging a function it passes the call arguments into the hook function", function(){
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
});
