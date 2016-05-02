export default [
    {
        title: "debugScroll",
        debugCalls: [{
            obj: "window",
            prop: "scrollTo"
        }, {
            obj: "window",
            prop: "scrollBy"
        }],
        debugPropertySets: [{
            obj: "document.body",
            prop: "scrollTop"
        }, {
            obj: "document.body",
            prop: "scrollLeft"
        }, {
            obj: "Element.prototype",
            prop: "scrollTop"
        }, {
            obj: "Element.prototype",
            prop: "scrollLeft"
        }],
        getTraceInfo: function(details){
            if (details.propertyName == "scrollTo"
                || details.propertyName == "scrollBy") {
                return ["The scroll position of \"window\" was changed by the \"" + details.propertyName + "\" call"];
            } else {
                return ["The scroll position of", details.thisArgument, "was changed by the \"" + details.propertyName + "\" call"];
            }
        }
    },
    {
        title: "debugCookieReads",
        debugPropertyGets: [{
            obj: "document",
            prop: "cookie"
        }],
        traceMessage: "Reading cookie contents"
    },
    {
        title: "debugCookieWrites",
        debugPropertySets: [{
            obj: "document",
            prop: "cookie"
        }],
        traceMessage: "Updating cookie contents"
    },
    {
        title: "debugAlertCalls",
        debugCalls: [{
            obj: "window",
            prop: "alert"
        }],
        traceMessage: "Showing alert box"
    }, {
        title: "debugElementSelection",
        debugCalls: [{
            obj: "document",
            prop: "getElementById"
        }, {
            obj: "document",
            prop: "getElementsByClassName"
        }, {
            obj: "document",
            prop: "getElementsByName"
        }, {
            obj: "document",
            prop: "getElementsByTagName"
        }, {
            obj: "document",
            prop: "getElementsByTagNameNS"
        }, {
            obj: "document",
            prop: "getElementsByClassName"
        }, {
            obj: "document",
            prop: "querySelector"
        }, {
            obj: "document",
            prop: "querySelectorAll"
        }, {
            obj: "document",
            prop: "evaluate" // xpath
        }],
        getTraceInfo: function(details){
            return ["Selecting DOM elements \"" + details.callArguments[0] + "\" using " + details.propertyName];
        }
    },
    {
        title: "debugConsoleErrorCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "error"
        }],
        traceMessage: "Calling console.error"
    },
    {
        title: "debugConsoleLogCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "log"
        }],
        traceMessage: "Calling console.log"
    },
    {
        title: "debugConsoleTraceCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "trace"
        }],
        traceMessage: "Calling console.trace"
    },
    {
        title: "debugMathRandom",
        debugCalls: [
            {
                obj: "window.Math",
                prop: "random"
            }
        ],
        getTraceInfo: function(){
            return ["Calling Math.random"]
        }
    },
    {
        title: "debugTimerCreation",
        debugCalls: [
            {
                obj: "window",
                prop: "setTimeout"
            },
            {
                obj: "window",
                prop: "setInterval"
            }
        ],
        getTraceInfo: function(details){
            return ["Creating timer using " + details.propertyName]
        }
    },
    {
        title:  "debugLocalStorageReads",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "getItem"
        }],
        getTraceInfo: function(details){
            return ["Reading localStorage data for key \"" + details.callArguments[0] + "\""];
        }
    },
    {
        title:  "debugLocalStorageWrites",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "setItem"
        }, {
            obj: "window.localStorage",
            prop: "clear"
        }],
        getTraceInfo: function(details){
            return ["Writing localStorage data for key \"" + details.callArguments[0] + "\""];
        }
    }
];
