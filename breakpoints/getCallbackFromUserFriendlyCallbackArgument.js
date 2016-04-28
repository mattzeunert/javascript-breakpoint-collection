function debuggerFunction(details){
    debugger;
}
debuggerFunction.type = "debugger"

export default function getCallbackFromUserFriendlyCallbackArgument(callback, predefinedBreakpoint){
    if (typeof callback === "function") {
        callback.callbackType = "custom"
        return callback;
    } else if (typeof callback === "string") {
        if (callback === "debugger") {
            return debuggerFunction

        } else if (callback === "trace") {
            return getTraceFunction(predefinedBreakpoint);
        } else {
            throw new Error("Invalid string callback")
        }
    } else if(typeof callback=== "undefined") {
        return debuggerFunction;
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
                console.trace.apply(console, traceArgs);
            }
        }
        else if (predefinedBreakpoint.traceMessage) {
            traceFn = function(){
                console.trace(predefinedBreakpoint.traceMessage)
            }
        }
    }
    else {
        traceFn = function(debugInfo){
            console.trace("About to " + debugInfo.data.accessType + " property '" + debugInfo.propertyName + "' on this object: ", debugInfo.object)
        }
    }
    
    traceFn.callbackType = "trace"
    return traceFn
}