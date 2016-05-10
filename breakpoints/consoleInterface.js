import debugObj, {debugObjBreakpointRegistry, objectsAndPropsByDebugId, disableBreakpointsDuringAllFunctionCalls} from "./debugObj"
import predefinedBreakpoints from "./predefinedBreakpoints"
import getCallbackFromUserFriendlyCallbackArgument from "./getCallbackFromUserFriendlyCallbackArgument"
import breakpointCombinations from "./breakpointCombinations"

function pushRegisteredBreakpointsToExtension() {
    if (typeof CustomEvent === "undefined"
        || typeof window === "undefined"
        || !window.dispatchEvent
    ) {
        return; // probably in a Node environment
    }
    var event = new CustomEvent("RebroadcastExtensionMessage", {
        type: "updateRegisteredBreakpoints",
        registeredBreakpoints: breakpointCombinations.getRegisteredBreakpoints()
    });
    window.dispatchEvent(event);
}

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
        objectsAndPropsByDebugId
    },
    getRegisteredBreakpoints: function(){
        return breakpointCombinations.getRegisteredBreakpoints();
    },
    setTypeOfMostRecentBreakpointToDebugger: function(){
        breakpointCombinations.setTypeOfMostRecentBreakpointToDebugger();
        pushRegisteredBreakpointsToExtension();
    }
}

disableBreakpointsDuringAllFunctionCalls(__internal)

function publicDebugPropertyAccess(obj, prop, callback, accessType) {
    var functionName = {
        "get": "debugPropertyGet",
        "set": "debugPropertySet",
        "call": "debugPropertyCall"
    }[accessType];

    callback = getCallbackFromUserFriendlyCallbackArgument(callback);
    __internal.registerBreakpoint(function(
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
        type: callback.callbackType
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

        var resetFn = __internal.registerBreakpoint(fn,  details, breakpoint);
        pushRegisteredBreakpointsToExtension();
        return resetFn;
    }
});

disableBreakpointsDuringAllFunctionCalls(breakpoints);

export default breakpoints
export { pushRegisteredBreakpointsToExtension }
