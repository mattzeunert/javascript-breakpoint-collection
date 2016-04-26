import debugObj, {debugObjBreakpointRegistry, objectsAndPropsByDebugId, updateDebugIdCallback} from "./breakpoints/debugObj"
import predefinedBreakpoints from "./breakpoints/predefinedBreakpoints"
import getCallbackFromUserFriendlyCallbackArgument from "./breakpoints/getCallbackFromUserFriendlyCallbackArgument"
import breakpointCombinations, {registeredBreakpoints} from "./breakpoints/breakpointCombinations"

(function(){
    if (window.breakpoints !== undefined) {
        if (!window.breakpoints.__internal || !window.breakpoints.__internal.isBreakpointCollectionExtension) {
            console.log("Breakpoints extension can't load, global `breakpoints` variable is already defined")
        }
        return;
    }

    function pushRegisteredBreakpointsToExtension() {
        var event = new CustomEvent("RebroadcastExtensionMessage", {
            type: "updateRegisteredBreakpoints",
            registeredBreakpoints: breakpointCombinations.getRegisteredBreakpoints()
        });
        window.dispatchEvent(event);
    }

    pushRegisteredBreakpointsToExtension();

    var __internal = {
        updateBreakpointType: function(id, newType){
            breakpointCombinations.updateType(id, newType)
            pushRegisteredBreakpointsToExtension();
        },
        disableBreakpoint: function(id){
            breakpointCombinations.disable(id);
            pushRegisteredBreakpointsToExtension();
        },
        registerBreakpoint: function(){
            var id = breakpointCombinations.register.apply(null, arguments);
            pushRegisteredBreakpointsToExtension();
            return id;
        },
        isBreakpointCollectionExtension: true,
        debug: {
            debugObj,
            debugObjBreakpointRegistry,
            objectsAndPropsByDebugId,
            registeredBreakpoints
        },
        registerBreakpointAndGetResetBreakpointFunction: function(){
            var breakpointId = __internal.registerBreakpoint.apply(this, arguments);
            var disable = function(){
                __internal.disableBreakpoint(breakpointId);
            }
            // this function appears in the output after using
            // `breakpoints` in the consle, so make it pretty
            return function resetBreakpoint(){ disable() }
        },
        getRegisteredBreakpoints: function(){
            return breakpointCombinations.getRegisteredBreakpoints();
        },
        setTypeOfMostRecentBreakpointToDebugger: function(){
            breakpointCombinations.setTypeOfMostRecentBreakpointToDebugger();
            pushRegisteredBreakpointsToExtension();
        }
    }

    function publicDebugPropertyAccess(obj, prop, callback, accessType) {
        var functionName = {
            "get": "debugPropertyGet",
            "set": "debugPropertySet",
            "call": "debugPropertyCall"
        }[accessType];

        callback = getCallbackFromUserFriendlyCallbackArgument(callback);
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
            breakpointCombinations.resetAll()
            pushRegisteredBreakpointsToExtension();
        },
        resetLastBreakpoint: function(){
            if (breakpointCombinations.getRegisteredBreakpoints().length === 0) {
                console.log("No breakpoints are currently registered")
                return;
            }
            breakpointCombinations.resetLastBreakpoint();
            pushRegisteredBreakpointsToExtension();
        },
        __internal
    }
    
    predefinedBreakpoints.forEach(function(breakpoint){
        breakpoints[breakpoint.title] = function(callback){
            callback = getCallbackFromUserFriendlyCallbackArgument(callback, breakpoint);

            var details = {
                title: breakpoint.title,
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

            var resetFn = __internal.registerBreakpointAndGetResetBreakpointFunction(fn,  details);
            pushRegisteredBreakpointsToExtension();
            return resetFn;
        }
    });

    window.breakpoints = breakpoints;
})();
