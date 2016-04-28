export default [
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
        traceMessage: "Changing body scroll position"
    },
    {
        title:  "debugLocalStorageReads",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "getItem"
        }],
        traceMessage: "Reading localStorage data"
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
        traceMessage: "Writing localStorage data"
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
            return ["Selecting DOM elements using " + details.propertyName];
        }
    }
];