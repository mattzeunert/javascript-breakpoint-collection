import {runWithBreakpointsDisabled} from "./debugObj"

function getDebuggerFunction() {
    var debuggerFunc = function() {
        debugger;
    }
    debuggerFunc.callbackType = "debugger";
    return debuggerFunc;
}

export default function getCallbackFromUserFriendlyCallbackArgument(callback, predefinedBreakpoint){
    if (typeof callback === "function") {
        callback.callbackType = "custom"
        return callback;
    } else if (typeof callback === "string") {
        if (callback === "debugger") {
            return getDebuggerFunction();

        } else if (callback === "trace") {
            return getTraceFunction(predefinedBreakpoint);
        } else {
            throw new Error("Invalid string callback")
        }
    } else if(typeof callback=== "undefined") {
        return getDebuggerFunction();
    } else {
        throw new Error("Invalid callback type: " + typeof callback)
    }
}

function getTraceFunction(predefinedBreakpoint) {
    var traceFn;
    if (predefinedBreakpoint) {
        if (predefinedBreakpoint.getTraceInfo) {
            traceFn = function(){
                try {
                    var traceArgs = predefinedBreakpoint.getTraceInfo.apply(null, arguments);

                    runWithBreakpointsDisabled(function(){
                        console.trace.apply(console, traceArgs);
                    });
                } catch (err) {
                    console.error("Generating trace message failed", err);
                }
            }
        }
        else if (predefinedBreakpoint.traceMessage) {
            traceFn = function(){
                runWithBreakpointsDisabled(function(){
                    console.trace(predefinedBreakpoint.traceMessage)
                })
            }
        }
    }
    else {
        traceFn = function(debugInfo){
            runWithBreakpointsDisabled(function() {
                getTraceInfo(debugInfo);
            });
        }
    }

    traceFn.callbackType = "trace";
    return traceFn;
}

function getTraceInfo(debugInfo) {
    var truncate = function(str) {
        return str.substring(0, 25) + "...";
    };

    try {
        var message = "About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' ";

        if (debugInfo.accessType == "set") {
            const MAX_LENGTH = 25;
            var newPropertyValue = debugInfo.newPropertyValue;
            var newPropertyType = typeof newPropertyValue;

            var isArray = (newPropertyValue !== undefined && newPropertyValue != null &&
                newPropertyValue.constructor === Array);

            if (newPropertyType === "string") {
                if (newPropertyValue.length > MAX_LENGTH) {
                    newPropertyValue = truncate(newPropertyValue);
                }
            } else if (isArray) {
                try {
                    newPropertyValue = JSON.stringify(newPropertyValue);

                    if (newPropertyValue.length > MAX_LENGTH) {
                        newPropertyValue = truncate(newPropertyValue) + "]";
                    }
                } catch(e) {
                    newPropertyValue = newPropertyValue.toString(); // fallback to a shallow version
                    newPropertyValue = "[" + (newPropertyValue.length > MAX_LENGTH ? truncate(newPropertyValue) : newPropertyValue) + "]";
                }
            }

            if (isArray) {
                console.trace(message + "to " + newPropertyValue + " on this object: ", debugInfo.object);
            } else {
                console.trace(message + "to %o ", newPropertyValue," on this object: ", debugInfo.object);
            }
        }
        else {
            console.trace(message + "on this object: ", debugInfo.object);
        }
    } catch (err) {
        // in case something else breaks the trace message, we don't want to break the whole app
        console.error("Generating trace message failed", err);
    }
}
