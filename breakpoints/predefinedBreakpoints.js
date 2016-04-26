export default [
    {
        title: "debugCookieReads",
        debugPropertyGets: [{
            obj: "document",
            prop: "cookie"
        }],
        traceMessage: "About to read cookie contents"
    },
    {
        title: "debugCookieWrites",
        debugPropertySets: [{
            obj: "document",
            prop: "cookie"
        }],
        traceMessage: "About to update cookie contents"
    },
    {
        title: "debugAlertCalls",
        debugCalls: [{
            obj: "window",
            prop: "alert"
        }],
        traceMessage: "About to show alert box"
    },
    {
        title: "debugConsoleErrorCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "error"
        }],
        traceMessage: "About to call console.error"
    },
    {
        title: "debugConsoleLogCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "log"
        }],
        traceMessage: "About to call console.log"
    },
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
        traceMessage: "About to change body scroll position"
    },
    {
        title:  "debugLocalStorageReads",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "getItem"
        }],
        traceMessage: "About to read localStorage data"
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
        traceMessage: "About to write localStorage data"
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
        getTraceInfo: function(){
            return ["About to select DOM elements"];
        }
    }
];