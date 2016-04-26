import debugObj, {registry, objectsAndPropsByDebugId, updateDebugIdCallback, resetDebug} from "./breakpoints/debugObj"
import predefinedBreakpoints from "./breakpoints/predefinedBreakpoints"

(function(){
    if (window.breakpoints !== undefined) {
        if (!window.breakpoints.__internal || !window.breakpoints.__internal.isBreakpointCollectionExtension) {
            console.log("Breakpoints extension can't load, global `breakpoints` variable is already defined")
        }
        return;
    }

    function debuggerFunction(){
        debugger;
    }
    debuggerFunction.callbackType = "debugger";
    

    function debugPropertyCall(object, prop, callback){
        callback = getCallbackFromUserFriendlyCallbackArgument(callback, object, prop, "call")

        return debugObj(object, prop, {
            propertyCallBefore: {
                fn: callback
            }
        })
    }

    var debugPropertyGet = function(object, propertyName, callback){
        return debugObj(object, propertyName, {
            propertyGetBefore: {
                fn: callback
            }
        })
    }
    var debugPropertySet = function(object, propertyName, callback) {
        return debugObj(object, propertyName, {
            propertySetBefore: {
                fn: callback
            }
        })
    }

    var registeredBreakpoints = [];

    function pushRegisteredBreakpointsToExtension() {
        var event = new CustomEvent("RebroadcastExtensionMessage", {
            type: "updateRegisteredBreakpoints",
            registeredBreakpoints: registeredBreakpoints
        });
        window.dispatchEvent(event);
    }

    pushRegisteredBreakpointsToExtension();

    function getCallbackFromUserFriendlyCallbackArgument(callback, object, propertyName, accessType){
        if (typeof callback === "function") {
            callback.callbackType = "custom"
            return callback;
        } else if (typeof callback === "string") {
            if (callback === "debugger") {
                return debuggerFunction;
            } else if (callback === "trace") {
                return getTraceFunction(object, propertyName, accessType);
            } else {
                throw new Error("Invalid string callback")
            }
        } else if(typeof callback=== "undefined") {
            return debuggerFunction;
        } else {
            throw new Error("Invalid callback type")
        }
    }

    function getTraceFunction(object, propertyName, accessType) {
        var traceFn = function(){
            console.trace("About to " + accessType + " property '" + propertyName + "' on this object: ", object)
        }
        traceFn.callbackType = "trace"
        return traceFn
    }

    function getCallbackFromBreakpointDetails(details, object, propertyName) {
        if (details.type === "debugger") {
            return debuggerFunction;
        }
        else if (details.type === "trace") {
            return function(){
                var traceMessage = details.traceMessage;
                if (traceMessage !== undefined) {
                    console.trace(details.traceMessage);
                }
                else {
                    var traceFn = getTraceFunction(object, propertyName, details.accessType);
                    traceFn();
                }
            }
        } else {
            throw new Error("Invalid breakpoint type")
        }
    }

    var __internal = {
        isBreakpointCollectionExtension: true,
        debug: {
            _registry: registry,
            _debugObj: debugObj,
            _objectsAndPropsByDebugId: objectsAndPropsByDebugId,
            _registeredBreakpoints: registeredBreakpoints
        },
        registerBreakpointAndGetResetBreakpointFunction: function(){
            var breakpointId = __internal.registerBreakpoint.apply(this, arguments);
            // Comments in following functions are to show more info when function appears logged in console
            return function resetBreakpoint(){
                __internal.disableBreakpoint(breakpointId);
            }
        },
        registerBreakpoint: function(fn, bpDetails, fixedCallback){
            var debugIds = [];
            var _debugPropertyGet = function(object, propertyName, callback){
                if (fixedCallback) {
                    callback = fixedCallback;
                }
                debugIds.push(debugPropertyGet(object, propertyName, callback));
            }
            var _debugPropertySet = function(object, propertyName, callback){
                if (fixedCallback) {
                    callback = fixedCallback;
                }
                debugIds.push(debugPropertySet(object, propertyName, callback));
            }
            var _debugPropertyCall = function(object, propertyName, callback){
                if (fixedCallback) {
                    callback = fixedCallback;
                }
                debugIds.push(debugPropertyCall(object, propertyName, callback));
            }
            fn(_debugPropertyGet, _debugPropertySet, _debugPropertyCall);
            var id = Math.floor(Math.random() * 1000000000)
            registeredBreakpoints.push({
                id: id,
                debugIds,
                details: bpDetails,
                createdAt: new Date()
            });

            pushRegisteredBreakpointsToExtension();

            return id;
        },
        createSpecificBreakpoint: function(breakpointName){
            // would be cleaner if this didn't use the public console API
            // but instead something on __internal
            window.breakpoints[breakpointName]("trace");
        },
        registerBreakpointFromExtension: function(fn, bpDetails){
            var fixedCallback = getCallbackFromBreakpointDetails(bpDetails);
            var id = window.breakpoints.__internal.registerBreakpoint(fn, bpDetails, fixedCallback);
        },
        getRegisteredBreakpoints: function(){
            return registeredBreakpoints;
        },
        disableBreakpoint: function(id, dontPushToExtension){
            var bp = registeredBreakpoints.filter(function(bp){
                return bp.id == id;
            })[0];
            if (bp === undefined) {
                console.log("Couldn't find breakpoint with id", id)
                return;
            }
            bp.debugIds.forEach(function(debugId){
                resetDebug(debugId);
            });
            registeredBreakpoints = registeredBreakpoints.filter(function(bp){
                return bp.id != id;
            })

            if (!dontPushToExtension) {
                pushRegisteredBreakpointsToExtension();
            }
        },
        updateBreakpoint: function(id, details){
            var bp = registeredBreakpoints.filter(function(bp){
                return bp.id == id;
            })[0];

            bp.debugIds.forEach(function(debugId){
                var objAndProp = objectsAndPropsByDebugId[debugId];
                var object = objAndProp.obj;
                var propertyName = objAndProp.prop;
                var callback = getCallbackFromBreakpointDetails(details, object, propertyName);
                updateDebugIdCallback(debugId, callback)
            });
            
            bp.details = details;

            pushRegisteredBreakpointsToExtension();
        },
        setTypeOfMostRecentBreakpointToDebugger: function(){
            var mostRecentBreakpoint = registeredBreakpoints[registeredBreakpoints.length - 1];
            var newDetails = mostRecentBreakpoint.details;
            newDetails.type = "debugger"
            __internal.updateBreakpoint(mostRecentBreakpoint.id, newDetails)
        }
    }

    function publicDebugPropertyAccess(obj, prop, callback, accessType) {
        var functionName = {
            "get": "debugPropertyGet",
            "set": "debugPropertySet",
            "call": "debugPropertyCall"
        }[accessType];

        callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "get");
        return __internal.registerBreakpointAndGetResetBreakpointFunction(function(
            debugPropertyGet, debugPropertySet, debugPropertyCall
            ){
                var debugFunctions = {
                    debugPropertyGet,
                    debugPropertySet,
                    debugPropertyCall
                }
                debugFunctions[functionName](obj, prop, callback);
        }, {
            title: functionName + " (" + prop + ")",
            type: callback.callbackType,
            accessType: accessType
        });
    }

    var breakpoints = {
        debugPropertyGet: function(obj, prop, callback){
            return publicDebugPropertyAccess(obj, prop, callback, "get")
        },
        debugPropertySet: function(obj, prop, callback){
            return publicDebugPropertyAccess(obj, prop, callback, "set")
        },
        debugPropertyCall: function(obj, prop, callback){
            return publicDebugPropertyAccess(obj, prop, callback, "call")
        },
        resetAllBreakpoints: function(){
            registeredBreakpoints.forEach(function(breakpoint){
                __internal.disableBreakpoint(breakpoint.id, true);
            });
            pushRegisteredBreakpointsToExtension();
        },
        resetLastBreakpoint: function(){
            if (registeredBreakpoints.length === 0) {
                console.log("No breakpoints are currently registered")
                return;
            }
            var breakpointToReset = registeredBreakpoints[registeredBreakpoints.length - 1];
            __internal.disableBreakpoint(breakpointToReset.id);
        },
        __internal
    }
    
    predefinedBreakpoints.forEach(function(breakpoint){
        breakpoints[breakpoint.title] = function(callback){
            callback = getCallbackFromUserFriendlyCallbackArgument(callback);

            var details = {
                title: breakpoint.title,
                traceMessage: breakpoint.traceMessage,
                type: callback.callbackType
            }

            var fn = function(debugPropertyGet, debugPropertySet, debugPropertyCall){
                if (breakpoint.debugPropertyGets) {
                    breakpoint.debugPropertyGets.forEach(function(property){
                        debugPropertyGet(eval(property.obj), property.prop, callback)
                    })
                }
                if (breakpoint.debugPropertySets) {
                    breakpoint.debugPropertySets.forEach(function(property){
                        debugPropertySet(eval(property.obj), property.prop, callback)
                    })
                }
                if (breakpoint.debugCalls) {
                    breakpoint.debugCalls.forEach(function(property){
                        debugPropertyCall(eval(property.obj), property.prop, callback)
                    })
                }
            }

            return __internal.registerBreakpointAndGetResetBreakpointFunction(fn,  details);
        }
    });

    window.breakpoints = breakpoints;
})();
