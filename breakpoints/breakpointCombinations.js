import debugObj, {resetDebug, updateDebugIdCallback} from "./debugObj"
import getCallbackFromUserFriendlyCallbackArgument from "./getCallbackFromUserFriendlyCallbackArgument"
var registeredBreakpoints = [];

function debugPropertyCall(object, prop, callback){
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

var breakpointCombinations = {
    register(fn, bpDetails, predefinedBreakpoint) {
        var debugIds = [];
        var _debugPropertyGet = function(object, propertyName, callback){
            debugIds.push(debugPropertyGet(object, propertyName, callback));
        }
        var _debugPropertySet = function(object, propertyName, callback){
            debugIds.push(debugPropertySet(object, propertyName, callback));
        }
        var _debugPropertyCall = function(object, propertyName, callback){
            debugIds.push(debugPropertyCall(object, propertyName, callback));
        }
        fn(_debugPropertyGet, _debugPropertySet, _debugPropertyCall);

        var id = Math.floor(Math.random() * 1000000000)
        var bp = {
            id: id,
            debugIds,
            details: bpDetails,
            createdAt: new Date(),
            predefinedBreakpoint
        }
        registeredBreakpoints.push(bp);

        return id;
    },
    disable(id){
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
    },
    updateType(id, newType){
        if (newType !== "debugger" && newType !== "trace") {
            throw new Error("Invalid breakpoint type")
        }

        var bp = registeredBreakpoints.filter(function(bp){
            return bp.id == id;
        })[0];

        var callback = getCallbackFromUserFriendlyCallbackArgument(newType, bp.predefinedBreakpoint);
        bp.debugIds.forEach(function(debugId){
            updateDebugIdCallback(debugId, callback)
        });

        bp.details.type = newType;
    },
    resetAll(){
        registeredBreakpoints.forEach(function(breakpoint){
            breakpointCombinations.disable(breakpoint.id);
        });
    },
    getRegisteredBreakpoints(){
        return registeredBreakpoints;
    },
    resetLastBreakpoint(){
        var breakpointToReset = registeredBreakpoints[registeredBreakpoints.length - 1];
        breakpointCombinations.disable(breakpointToReset.id);
    },
    setTypeOfMostRecentBreakpointToDebugger(){
        var mostRecentBreakpoint = registeredBreakpoints[registeredBreakpoints.length - 1];
        breakpointCombinations.updateType(mostRecentBreakpoint.id, "debugger")
    }
}

export default breakpointCombinations;
