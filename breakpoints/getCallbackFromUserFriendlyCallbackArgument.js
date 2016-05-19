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
                try {
                    if (debugInfo.accessType == "set") {
                        const MAX_LENGTH = 25;
                        var isArray = false;

                        var newPropertyValue = debugInfo.newPropertyValue;
                        var newPropertyType = typeof newPropertyValue;

                        if (newPropertyType === "string") {
                            if (newPropertyValue.length > MAX_LENGTH) {
                                newPropertyValue = newPropertyValue.substring(0, 25) + "...";
                            }
                        } else if (typeof newPropertyValue !== "undefined" && newPropertyValue != null && newPropertyValue.constructor === Array) {
                            isArray = true;

                            try {
                                newPropertyValue = JSON.stringify(newPropertyValue);

                                if (newPropertyValue.length > MAX_LENGTH) {
                                    newPropertyValue = newPropertyValue.substring(0, 25) + "...]"
                                }
                            } catch(e) {
                                newPropertyValue = newPropertyValue.toString(); // fallback to a shallow version
                                newPropertyValue = "[" + newPropertyValue.substring(0, 25) + (newPropertyValue.length > MAX_LENGTH ? "...]" : "]");
                            }
                        }

                        if (isArray) {
                            console.trace("About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' to " + newPropertyValue +
                            " on this object: ", debugInfo.object);
                        } else {
                            console.trace("About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' to %o ", newPropertyValue,
                            " on this object: ", debugInfo.object);
                        }
                    }
                    else {
                        console.trace("About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' on this object: ", debugInfo.object);
                    }
                } catch (err) {
                    console.error("Generating trace message failed", err);
                }
            })
        }
    }

    traceFn.callbackType = "trace"
    return traceFn
}
