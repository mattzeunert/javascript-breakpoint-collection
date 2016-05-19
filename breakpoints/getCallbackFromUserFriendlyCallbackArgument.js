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
                var traceArgs = predefinedBreakpoint.getTraceInfo.apply(null, arguments);
                runWithBreakpointsDisabled(function(){
                    console.trace.apply(console, traceArgs);
                })
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
            runWithBreakpointsDisabled(function(){
                if (debugInfo.accessType == "set") {
                    var newPropertyValue = debugInfo.newPropertyValue;
                    var newPropertyType = typeof newPropertyValue;

                    if (newPropertyType === "string" || newPropertyType === "number") {
                        newPropertyValue = newPropertyValue.toString();

                        if (newPropertyValue.length > 10) {
                            newPropertyValue = newPropertyValue.substring(0, 10) + "...";
                        }

                        if (newPropertyType === "string") {
                            newPropertyValue = "'" + newPropertyValue + "'";
                        }
                    }
                    else if (newPropertyType === "boolean") {
                        // use existing value
                    } else {
                        newPropertyValue = "[omitted]"; // all other types are omitted as they are difficult to represent in console
                    }

                    console.trace("About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' to " + newPropertyValue
                    + " (" + newPropertyType + ") on this object: ", debugInfo.object)
                }
                else {
                    console.trace("About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' on this object: ", debugInfo.object);
                }
            })
        }
    }

    traceFn.callbackType = "trace"
    return traceFn
}
