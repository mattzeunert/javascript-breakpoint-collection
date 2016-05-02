import "../extension/build/javascript-breakpoint-collection"

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

describe("breakpoints.resetAllBreakpoints", function(){
    it("Disables all breakpoints", function(){
        var obj = {hi: "there"}
        var fn1 = jasmine.createSpy();
        breakpoints.debugPropertySet(obj, "hi", fn1);

        var fn2 = jasmine.createSpy();
        breakpoints.debugCookieReads(fn2);

        breakpoints.resetAllBreakpoints();
        var cookie = document.cookie;
        obj.hi = "hey";

        expect(fn1).not.toHaveBeenCalled();
        expect(fn2).not.toHaveBeenCalled();
    });
});

describe("breakpoints.resetLastBreakpoint", function(){
    it("Disables the last breakpoint that was added", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugCookieReads(fn);
        breakpoints.resetLastBreakpoint();
        var cookie = document.cookie;
        expect(fn).not.toHaveBeenCalled();
    })
    it("Disables the breakpoints in reverse order", function(){
        var fn1 = jasmine.createSpy();
        breakpoints.debugCookieReads(fn1);
        var fn2 = jasmine.createSpy();
        breakpoints.debugCookieWrites(fn2);
        breakpoints.resetLastBreakpoint();
        document.cookie = "test";
        var cookie = document.cookie;
        expect(fn2).not.toHaveBeenCalled();
        expect(fn1).toHaveBeenCalled();
        breakpoints.resetLastBreakpoint();
        cookie = document.cookie;
        expect(fn1.calls.count()).toBe(1);
    })
})

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
    it("Shows a predefined trace message", function(){
        var fn = spyOn(console, "trace");
        breakpoints.debugCookieReads("trace");
        var cookie = document.cookie;
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("Reading cookie contents");
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

describe("debugMathRandom", function(){
    it("Hits when Math.random is called and shows a trace message", function(){
        spyOn(console, "trace");
        breakpoints.debugMathRandom("trace");
        Math.random();
        expect(console.trace).toHaveBeenCalled();
    })
})

describe("debugTimerCreation", function(){
    it("Shows a trace message when setTimeout is called", function(){
        spyOn(console, "trace");
        breakpoints.debugTimerCreation("trace");
        setTimeout(function(){}, 0);
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("Creating timer using setTimeout")
    });
})

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
    it("Shows the scroll position message", function(){
        spyOn(console, "trace");
        breakpoints.debugScroll("trace");
        var myParagraph = document.createElement("p");
        myParagraph.id = "myParagraph";
        var div = document.createElement("div");
        div.appendChild(myParagraph);
        document.body.appendChild(div);
        document.getElementById("myParagraph").scrollTop = 10;
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("The scroll position of");
        expect(console.trace.calls.mostRecent().args[1].outerHTML).toBe("<p id=\"myParagraph\"></p>");
        expect(console.trace.calls.mostRecent().args[2]).toBe("was changed by the \"scrollTop\" call");
    })
    it("Shows the scroll position message", function(){
        spyOn(console, "trace");
        breakpoints.debugScroll("trace");
        window.scrollTo(10, 10);
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("The scroll position of \"window\" was changed by the \"scrollTo\" call");
    })
})

describe("debugLocalStorageReads", function(){
    it("Hits when localStorage.getItem is called", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugLocalStorageReads(fn);
        localStorage.getItem("hello");
        expect(fn).toHaveBeenCalled();
    })
    it("Shows the data key in the trace message", function(){
        spyOn(console, "trace");
        breakpoints.debugLocalStorageReads("trace");
        localStorage.getItem("hello");
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("Reading localStorage data for key \"hello\"");
    })
})

describe("debugLocalStorageWrites", function(){
    it("Shows the data key in the trace message", function(){
        spyOn(console, "trace");
        breakpoints.debugLocalStorageWrites("trace");
        localStorage.setItem("hi", "there");
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("Writing localStorage data for key \"hi\"");
    })
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

describe("debugElementSelection", function(){
    it("Hits when document.getElementById is called", function(){
        var fn = jasmine.createSpy();
        breakpoints.debugElementSelection(fn);
        document.getElementById("test")
        expect(fn).toHaveBeenCalled();
    });
    it("Shows the function that was called in the trace message", function(){
        spyOn(console, "trace");
        breakpoints.debugElementSelection("trace");
        document.getElementsByClassName("hello");
        expect(console.trace).toHaveBeenCalled();
        expect(console.trace.calls.mostRecent().args[0]).toBe("Selecting DOM elements \"hello\" using getElementsByClassName");
    })
    //it's all just a list of calls... no point in duplicating them all here
})
