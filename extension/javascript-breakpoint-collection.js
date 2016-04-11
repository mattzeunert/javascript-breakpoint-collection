




(function(){
    var log = function(){}
    

    if (window.breakpoints !== undefined) {
        //console.log("already injected, or another part of the page uses the window.breakpoints property")
        return;
    }

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

    function debugObj(obj, prop, options) {
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
                    triggerHook("propertyGetBefore");
                    if (isSimpleValue) {
                        retVal = originalProp.value;
                    } else {
                        retVal = originalProp.get.apply(this, arguments);    
                    }
                    if (typeof retVal === "function") {
                        return function(){
                            triggerHook("propertyCallBefore")
                            retVal.apply(this, arguments);
                            triggerHook("propertyCallAfter")
                        }
                    }

                    triggerHook("propertyGetAfter");
                    return retVal;
                },
                set: function(newValue){
                    var retVal;
                    triggerHook("propertySetBefore")
                    if (isSimpleValue) {
                        retVal = originalProp.value = newValue;
                    } else {
                        retVal = originalProp.set.apply(this, arguments);
                    }
                    triggerHook("propertySetAfter")
                    return retVal;
                }
            });
        }


        hookNames.forEach(function(hookName){
            if (options[hookName] !== undefined) {
                if (registry.get(obj)[prop].hooks[hookName] === undefined) {
                    registry.get(obj)[prop].hooks[hookName] = [];
                }
                registry.get(obj)[prop].hooks[hookName].push({
                    id: debugId,
                    fn: options[hookName]
                })
            }
        });

        return debugId;

        function triggerHook(hookName) {
            var hooks = registry.get(obj)[prop].hooks;
            var hooksWithName = hooks[hookName];
            if (hooksWithName !== undefined && hooksWithName.length > 0) {
                hooksWithName.forEach(function(hook){
                    hook.fn();
                })
            }
        }
    }

    function updateEachHook(obj, prop, cb){
        var hooks = registry.get(obj)[prop].hooks;
        hookNames.forEach(function(hookName){
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
            
            var hooksWithName = hooks[hookName];
            if (hooksWithName !== undefined) {
                hooks[hookName] = hooksWithName.map(function(hook){
                    return cb(hook, accessType)
                })
            }
        })
    }

    function updateDebugIdCallback(debugId, callback){
        var objAndProp = objectsAndPropsByDebugId[debugId];
        updateEachHook(objAndProp.obj, objAndProp.prop, function(hook, accessType){
            if (hook.id === debugId) {
                return {
                    id: debugId,
                    fn: callback
                }
            } else {
                return hook;
            }
        });
    }

    function resetDebug(id){
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


    function debuggerFunction(){
        debugger;
    }
    debuggerFunction.callbackType = "debugger";
    
    function getPropertyDescriptor(object, propertyName){
        try {
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
        } catch (err){
            log("are you sure the property ", propertyName, " exists?")
            throw err
        }
        if (!object){
            throw new Error("Descriptor " + propertyName + " not found");
        }
        if (!descriptor) {
            return getPropertyDescriptor(Object.getPrototypeOf(object), propertyName);
        }
        return descriptor;
    }


    function debugCall(object, prop, callback){
        callback = getCallbackFromUserFriendlyCallbackArgument(callback, object, prop, "call")

        return debugObj(object, prop, {
            propertyCallBefore: callback
        })
    }

    var debugPropertyGet = function(object, propertyName, callback){
        return debugObj(object, propertyName, {
            propertyGetBefore: callback
        })
    }
    var debugPropertySet = function(object, propertyName, callback) {
        return debugObj(object, propertyName, {
            propertySetBefore: callback
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

    window.breakpoints = {
        debugPropertyGet: function(obj, prop, callback){
            callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "get");
            window.breakpoints.__internal.registerBreakpoint(function(
                debugPropertyGet, debugPropertySet, debugCall
                ){
                    debugPropertyGet(obj, prop, callback);
            }, {
                title: "debugPropertyGet (" + prop + ")",
                type: callback.callbackType,
                accessType: "get"
            });
        },
        debugPropertySet: function(obj, prop, callback){
            callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "set");
            window.breakpoints.__internal.registerBreakpoint(function(
                debugPropertyGet, debugPropertySet, debugCall
                ){
                    debugPropertySet(obj, prop, callback);
            }, {
                title: "debugPropertySet (" + prop + ")",
                type: callback.callbackType,
                accessType: "set"
            });
        },
        debugPropertyCall: function(obj, prop, callback){
            callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "call");
            window.breakpoints.__internal.registerBreakpoint(function(
                debugPropertyGet, debugPropertySet, debugCall
                ){
                debugCall.apply(this, args)
            }, {
                title: "debugPropertyCall (" + prop + ")",
                type: callback.callbackType,
                accessType: "call"
            });

        },
        reset: function(id){
            resetDebug(id);
        },
        __internal: {
            debug: {
                _registry: registry,
                _debugObj: debugObj,
                _objectsAndPropsByDebugId: objectsAndPropsByDebugId,
                _registeredBreakpoints: registeredBreakpoints
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
                var _debugCall = function(object, propertyName, callback){
                    if (fixedCallback) {
                        callback = fixedCallback;
                    }
                    debugIds.push(debugCall(object, propertyName, callback));
                }
                fn(_debugPropertyGet, _debugPropertySet, _debugCall);
                var id = Math.floor(Math.random() * 1000000000)
                registeredBreakpoints.push({
                    id: id,
                    debugIds,
                    details: bpDetails
                });

                pushRegisteredBreakpointsToExtension();
            },
            registerBreakpointFromExtension: function(fn, bpDetails){
                var fixedCallback = getCallbackFromBreakpointDetails(bpDetails);
                var id = window.breakpoints.__internal.registerBreakpoint(fn, bpDetails, fixedCallback);
            },
            getRegisteredBreakpoints: function(){
                return registeredBreakpoints;
            },
            disableBreakpoint: function(id){
                var bp = registeredBreakpoints.filter(function(bp){
                    return bp.id == id;
                })[0];
                bp.debugIds.forEach(function(debugId){
                    resetDebug(debugId);
                });
                registeredBreakpoints = registeredBreakpoints.filter(function(bp){
                    return bp.id != id;
                })

                pushRegisteredBreakpointsToExtension();
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


            }
        }

    }
})();
