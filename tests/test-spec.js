import "../extension/javascript-breakpoint-collection"

describe("Combining multiple breakpoints on the same object", function(){
    it("Can combine setters and getters", function(){
        var obj = {
            hi: "there"
        };
        var fn = jasmine.createSpy();
        breakpoints.debugPropertyGet(obj, "hi", fn);
        breakpoints.debugPropertyGet(obj, "hi", fn);
        breakpoints.debugPropertySet(obj, "hi", fn);

        var sth = obj.hi;
        expect(fn.calls.count()).toBe(2);

        obj.hi = "hey";
        expect(fn.calls.count()).toBe(3);
    })
    it("Can debug multiple properties of an object", function(){
        var obj = {
            hi: "there", 
            hello: "world"
        }
        var fn = jasmine.createSpy();
        breakpoints.debugPropertyGet(obj, "hi", fn);
        breakpoints.debugPropertyGet(obj, "hello", fn);

        var sth = obj.hi;
        expect(fn.calls.count()).toBe(1);

        sth = obj.hello;
        expect(fn.calls.count()).toBe(2);
    })
});

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

describe("debugCookieReads", function(){
    it("Detects when the cookie is being read", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugCookieReads(fn);
        var cookie = document.cookie;
        expect(fn).toHaveBeenCalled();
    })
    it("Doesn't call the callback when the cookie property is being set", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugCookieReads(fn);
        document.cookie = "test";
        expect(fn).not.toHaveBeenCalled();
    });
});

describe("debugCookieWrites", function(){
    it("Detects when the cookie is being set", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugCookieWrites(fn);
        document.cookie = "hello";
        expect(fn).toHaveBeenCalled();
    })
})

describe("debugAlertCalls", function(){
    it("Detects when an alert box is shown", function(){
        var alertSpy = spyOn(window, "alert");
        var fn = jasmine.createSpy();
        breakpoints.debugAlertCalls(fn)
        window.alert("test");
        expect(fn).toHaveBeenCalled();
    })
})

describe("debugConsoleErrorCalls", function(){
    it("Detects when console.error is called", function(){
        var consoleErrorSpy = spyOn(console, "error");
        var fn = jasmine.createSpy();
        breakpoints.debugConsoleErrorCalls(fn);
        console.error("error")
        expect(fn).toHaveBeenCalled();
    });
});

describe("debugConsoleLogCalls", function(){
    it("Detects when console.log is called", function(){
        var consoleErrorSpy = spyOn(console, "log");
        var fn = jasmine.createSpy();
        breakpoints.debugConsoleLogCalls(fn);
        console.log("log")
        expect(fn).toHaveBeenCalled();
    });
});

describe("debugScroll", function(){
    it("Hits when window.scrollTo is called", function(){
        spyOn(window, "scrollTo")
        var fn = jasmine.createSpy();
        breakpoints.debugScroll(fn);
        window.scrollTo(50, 50);
        expect(fn).toHaveBeenCalled()
    });
    it("Hits when window.scrollBy is called", function(){
        spyOn(window, "scrollBy")
        var fn = jasmine.createSpy();
        breakpoints.debugScroll(fn);
        window.scrollBy(50, 50);
        expect(fn).toHaveBeenCalled()
    });
    it("Hits when scrollTop is set on the body", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugScroll(fn);
        document.body.scrollTop = 50;
        expect(fn).toHaveBeenCalled();
    })
    it("Hits when scrollLeft is set on the body", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugScroll(fn);
        document.body.scrollLeft = 50;
        expect(fn).toHaveBeenCalled();
    })
    it("Hits when scrollTop is set on an element", function(){
        var div = document.createElement("div");
        var fn = jasmine.createSpy();
        breakpoints.debugScroll(fn);
        div.scrollTop = 40;
        expect(fn).toHaveBeenCalled();
    });
    it("Hits when scrollLeft is set on an element", function(){
        var div = document.createElement("div");
        var fn = jasmine.createSpy();
        breakpoints.debugScroll(fn);
        div.scrollLeft = 40;
        expect(fn).toHaveBeenCalled();
    });
})

describe("debugLocalStorageReads", function(){
    it("Hits when localStorage.getItem is called", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugLocalStorageReads(fn);
        localStorage.getItem("hello");
        expect(fn).toHaveBeenCalled();
    })
})

describe("debugLocalStorageWrites", function(){
    it("Hits when localStorage.setItem is called", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugLocalStorageWrites(fn);
        localStorage.setItem("hi", "there");
        expect(fn).toHaveBeenCalled();
    })
    it("Hits when localStorage.clear is called", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugLocalStorageWrites(fn);
        localStorage.clear();
        expect(fn).toHaveBeenCalled();
    })
})