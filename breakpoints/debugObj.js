var registry = new Map();
var objectsAndPropsByDebugId = {}

var hookNames = [
    "propertyGetBefore",
    "propertyGetAfter",
    "propertySetBefore",
    "propertySetAfter",
    "propertyCallBefore",
    "propertyCallAfter"
];

function getPropertyDescriptor(object, propertyName){
    try {
        var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
    } catch (err){
        var newError = Error ("Are you sure the property \"" + propertyName + "\" exists?");
        newError.originalError = err;
        throw newError;
    }
    if (!object){
        throw new Error("Descriptor " + propertyName + " not found");
    }
    if (!descriptor) {
        return getPropertyDescriptor(Object.getPrototypeOf(object), propertyName);
    }
    return descriptor;
}

export { registry as debugObjBreakpointRegistry, objectsAndPropsByDebugId }

// counter instead of boolean to allow nested calls of runWithBreakpointsDisabled
var timesBreakpointsWereDisabled = 0;
export function runWithBreakpointsDisabled(fn){
    timesBreakpointsWereDisabled++;
    var retVal = fn();
    timesBreakpointsWereDisabled--;
    return retVal;
}

export function disableBreakpointsDuringAllFunctionCalls(object){
    for (var functionName in object){
        let fn = object[functionName];
        if (typeof fn !== "function") {
            continue;
        }

        object[functionName] = function(){
            var thisArg = this;
            var args = arguments;
            return runWithBreakpointsDisabled(function(){
                return fn.apply(thisArg, args);
            })
        }
    }
}

function areBreakpointsDisabled(){
    return timesBreakpointsWereDisabled > 0;
}

export default function debugObj(obj, prop, hooks) {
    var debugId = Math.floor(Math.random() * 100000000000).toString()
    objectsAndPropsByDebugId[debugId] = {
        obj,
        prop
    }

    if (registry.get(obj) === undefined) {
        registry.set(obj, {});
    }

    if (registry.get(obj)[prop] === undefined) {
        registry.get(obj)[prop] = {hooks: {}};

        var originalProp = getPropertyDescriptor(obj, prop);
        var isSimpleValue = "value" in originalProp; // rather than getter + setter

        Object.defineProperty(obj, prop, {
            get: function(){
                var retVal;

                triggerHook("propertyGetBefore", {
                    thisArgument: this
                });

                if (isSimpleValue) {
                    retVal = originalProp.value;
                } else {
                    retVal = originalProp.get.apply(this, arguments);
                }

                triggerHook("propertyGetAfter", {
                    thisArgument: this
                });

                if (typeof retVal === "function") {
                    return function(){
                        var args = Array.prototype.slice.call(arguments);

                        triggerHook("propertyCallBefore", {
                            callArguments: args,
                            thisArgument: this
                        });

                        var fnRetVal = retVal.apply(this, arguments);

                        triggerHook("propertyCallAfter", {
                            callArguments: args,
                            thisArgument: this
                        });

                        return fnRetVal;
                    }
                }

                return retVal;
            },
            set: function(newValue){
                var retVal;

                triggerHook("propertySetBefore", {
                    newPropertyValue: newValue,
                    thisArgument: this
                });

                if (isSimpleValue) {
                    retVal = originalProp.value = newValue;
                } else {
                    retVal = originalProp.set.apply(this, arguments);
                }

                triggerHook("propertySetAfter", {
                    newPropertyValue: newValue,
                    thisArgument: this
                });

                return retVal;
            }
        });
    }


    hookNames.forEach(function(hookName){
        if (hooks[hookName] !== undefined) {
            if (registry.get(obj)[prop].hooks[hookName] === undefined) {
                registry.get(obj)[prop].hooks[hookName] = [];
            }
            var hook = hooks[hookName];
            registry.get(obj)[prop].hooks[hookName].push({
                id: debugId,
                fn: hook.fn,
                data: hook.data
            })
        }
    });

    return debugId;

    function triggerHook(hookName, additionalHookInfo) {
        if (areBreakpointsDisabled()) {
            return;
        }
        var hooks = registry.get(obj)[prop].hooks;
        var hooksWithName = hooks[hookName];

        var infoForHook = {
            object: obj,
            propertyName: prop,
            ...additionalHookInfo
        }

        if (hooksWithName !== undefined && hooksWithName.length > 0) {
            hooksWithName.forEach(function(hook){
                hook.fn({
                    ...infoForHook,
                    accessType: getAccessTypeFromHookName(hookName),
                    data: hook.data
                });
            })
        }
    }
}

function getAccessTypeFromHookName(hookName){
    var accessType = "";
    if (hookName === "propertyGetBefore" || hookName === "propertyGetAfter") {
        accessType = "get";
    }
    if (hookName === "propertySetBefore" || hookName === "propertySetAfter") {
        accessType = "set";
    }
    if (hookName === "propertyCallBefore" || hookName === "propertyCallAfter") {
        accessType = "call";
    }
    return accessType;
}

function updateEachHook(obj, prop, cb){
    var hooks = registry.get(obj)[prop].hooks;
    hookNames.forEach(function(hookName){
        var hooksWithName = hooks[hookName];
        if (hooksWithName !== undefined) {
            hooks[hookName] = hooksWithName.map(function(hook){
                return cb(hook)
            })
        }
    })
}

export function updateDebugIdCallback(debugId, callback){
    var objAndProp = objectsAndPropsByDebugId[debugId];
    updateEachHook(objAndProp.obj, objAndProp.prop, function(hook){
        if (hook.id === debugId) {
            return {
                id: debugId,
                fn: callback,
                data: hook.data
            }
        } else {
            return hook;
        }
    });
}

export function resetDebug(id){
    var objAndProp = objectsAndPropsByDebugId[id];
    var hooks = registry.get(objAndProp.obj)[objAndProp.prop].hooks;
    for (var hookName in hooks) {
        var hooksWithName = hooks[hookName];
        hooks[hookName] = hooksWithName.filter(function(hook){
            return hook.id != id;
        })
    }

    delete objectsAndPropsByDebugId[id];
}
