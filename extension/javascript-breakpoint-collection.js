




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
                            // disable all after hooks for now since
                            // they aren't used and bp updates
                            // overwrite their no-op functions with 
                            // non no-ops
                            // triggerHook("propertyCallAfter")
                        }
                    }

                    // disable all after hooks for now since
                    // they aren't used and bp updates
                    // overwrite their no-op functions with 
                    // non no-ops
                    // triggerHook("propertyGetAfter");
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
                    // disable all after hooks for now since
                    // they aren't used and bp updates
                    // overwrite their no-op functions with 
                    // non no-ops
                    // triggerHook("propertySetAfter")
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

    function updateDebugIdHook(debugId, hookType){
        var objAndProp = objectsAndPropsByDebugId[debugId];
        updateEachHook(objAndProp.obj, objAndProp.prop, function(hook, accessType){
            if (hook.id === debugId) {
                return {
                    id: debugId,
                    fn: hookType === "debugger" ? debuggerFunction : function(){
                        console.trace("About to " + accessType + " " + objAndProp.prop + " property on", objAndProp.obj);
                    }
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



    function createPropertyAccessTypeDebugFunction(accessTypeToDebug) {
        return function(object, prop, options){
            log("create with ", options)
            var before, after;
            if (options === undefined) {
                before = debuggerFunction;
            }
            else if (typeof options === "string") {
                var hookType = options;
                if (hookType === "trace") {
                    before = function(){
                        console.trace("About to " + accessTypeToDebug + " " + prop + " property on", object);
                    }
                } else if (hookType==="debugger"){
                    before = function(){
                        debugger;
                    }
                } else {
                    throw "Invalid hook type"
                }
            }
            else {
                before = options.before;
                after = options.after;
            }
            var hooks = {};
            if (accessTypeToDebug === "get") {
                hooks.propertyGetBefore = function(){
                    if (before){
                        before.apply(this.arguments);
                    }
                }
            }
            if (accessTypeToDebug === "set") {
                hooks.propertySetBefore = function(){
                    if (before){
                        before.apply(this.arguments);
                    }
                }
            }
            return debugObj(object, prop, hooks)

        }
    }

    function debugCall(object, prop, options){
        var before, after;
        if (options === undefined) {
            before = debuggerFunction;
        } else if (typeof options === "string") {
            var hookType = options;
            if (hookType === "trace") {
                before = function(){
                    console.trace("About to call " + prop + " function on", object);
                }
            } else if (hookType==="debugger"){
                before = function(){
                    debugger
                }
            } else {
                throw "Invalid hook type"
            }
        } else if (typeof options === "function") {
            before = options;
        } else {
            before = options.before;
            after = options.after;
        }

        var hooks = {};
        if (before) {
            hooks.propertyCallBefore = before;
        }
        if (after){
            hooks.propertyCallAfter = after;
        }

        return debugObj(object, prop, hooks)
    }

    var debugPropertyGet = createPropertyAccessTypeDebugFunction("get");
    var debugPropertySet = createPropertyAccessTypeDebugFunction("set");

    var registeredBreakpoints = [];

    function pushRegisteredBreakpointsToExtension() {
        var event = new CustomEvent("RebroadcastExtensionMessage", {
            type: "updateRegisteredBreakpoints",
            registeredBreakpoints: registeredBreakpoints
        });
        window.dispatchEvent(event);
    }

    pushRegisteredBreakpointsToExtension();


    window.breakpoints = {
        debugPropertyGet: function(obj, prop){
            var args = arguments;
            window.breakpoints.__internal.registerBreakpoint(function(
                debugPropertyGet, debugPropertySet, debugCall
                ){
                debugPropertyGet.apply(this, args)
            }, {
                title: "debugPropertyGet (" + prop + ")",
                hook: "debugger"
            });
        },
        debugPropertySet: function(obj, prop){
            var args = arguments;
            window.breakpoints.__internal.registerBreakpoint(function(
                debugPropertyGet, debugPropertySet, debugCall
                ){
                debugPropertySet.apply(this, args)
            }, {
                title: "debugPropertySet (" + prop + ")",
                hook: "debugger"
            });
        },
        debugPropertyCall: function(obj, prop){
            var args = arguments;
            window.breakpoints.__internal.registerBreakpoint(function(
                debugPropertyGet, debugPropertySet, debugCall
                ){
                debugCall.apply(this, args)
            }, {
                title: "debugPropertyCall (" + prop + ")",
                hook: "debugger"
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
            registerBreakpoint: function(fn, bpDetails){
                var debugIds = [];
                var _debugPropertyGet = function(){
                    debugIds.push(debugPropertyGet.apply(this, arguments));
                }
                var _debugPropertySet = function(){
                    debugIds.push(debugPropertySet.apply(this, arguments));
                }
                var _debugCall = function(){
                    debugIds.push(debugCall.apply(this, arguments));
                }
                fn(_debugPropertyGet, _debugPropertySet, _debugCall);
                registeredBreakpoints.push({
                    id: Math.floor(Math.random() * 1000000000),
                    debugIds,
                    details: bpDetails
                })

                pushRegisteredBreakpointsToExtension();
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
            updateBreakpoint: function(id, settings, details){
                var bp = registeredBreakpoints.filter(function(bp){
                    return bp.id == id;
                })[0];

                if (settings.hookType) {
                    bp.debugIds.forEach(function(debugId){
                        updateDebugIdHook(debugId, settings.hookType)
                    });
                }

                bp.details = details;

                pushRegisteredBreakpointsToExtension();
            }
        }

    }
})();
