/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	(function () {
	    var log = function log() {};

	    if (window.breakpoints !== undefined) {
	        //console.log("already injected, or another part of the page uses the window.breakpoints property")
	        return;
	    }

	    var registry = new Map();
	    var objectsAndPropsByDebugId = {};

	    var hookNames = ["propertyGetBefore", "propertyGetAfter", "propertySetBefore", "propertySetAfter", "propertyCallBefore", "propertyCallAfter"];

	    function debugObj(obj, prop, options) {
	        var debugId = Math.floor(Math.random() * 100000000000).toString();
	        objectsAndPropsByDebugId[debugId] = {
	            obj: obj,
	            prop: prop
	        };

	        if (registry.get(obj) === undefined) {
	            registry.set(obj, {});
	        }

	        if (registry.get(obj)[prop] === undefined) {
	            registry.get(obj)[prop] = { hooks: {} };

	            var originalProp = getPropertyDescriptor(obj, prop);
	            var isSimpleValue = "value" in originalProp; // rather than getter + setter

	            Object.defineProperty(obj, prop, {
	                get: function get() {
	                    var retVal;
	                    triggerHook("propertyGetBefore");
	                    if (isSimpleValue) {
	                        retVal = originalProp.value;
	                    } else {
	                        retVal = originalProp.get.apply(this, arguments);
	                    }
	                    if (typeof retVal === "function") {
	                        return function () {
	                            triggerHook("propertyCallBefore");
	                            retVal.apply(this, arguments);
	                            triggerHook("propertyCallAfter");
	                        };
	                    }

	                    triggerHook("propertyGetAfter");
	                    return retVal;
	                },
	                set: function set(newValue) {
	                    var retVal;
	                    triggerHook("propertySetBefore");
	                    if (isSimpleValue) {
	                        retVal = originalProp.value = newValue;
	                    } else {
	                        retVal = originalProp.set.apply(this, arguments);
	                    }
	                    triggerHook("propertySetAfter");
	                    return retVal;
	                }
	            });
	        }

	        hookNames.forEach(function (hookName) {
	            if (options[hookName] !== undefined) {
	                if (registry.get(obj)[prop].hooks[hookName] === undefined) {
	                    registry.get(obj)[prop].hooks[hookName] = [];
	                }
	                registry.get(obj)[prop].hooks[hookName].push({
	                    id: debugId,
	                    fn: options[hookName]
	                });
	            }
	        });

	        return debugId;

	        function triggerHook(hookName) {
	            var hooks = registry.get(obj)[prop].hooks;
	            var hooksWithName = hooks[hookName];
	            if (hooksWithName !== undefined && hooksWithName.length > 0) {
	                hooksWithName.forEach(function (hook) {
	                    hook.fn();
	                });
	            }
	        }
	    }

	    function updateEachHook(obj, prop, cb) {
	        var hooks = registry.get(obj)[prop].hooks;
	        hookNames.forEach(function (hookName) {
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
	                hooks[hookName] = hooksWithName.map(function (hook) {
	                    return cb(hook, accessType);
	                });
	            }
	        });
	    }

	    function updateDebugIdCallback(debugId, callback) {
	        var objAndProp = objectsAndPropsByDebugId[debugId];
	        updateEachHook(objAndProp.obj, objAndProp.prop, function (hook, accessType) {
	            if (hook.id === debugId) {
	                return {
	                    id: debugId,
	                    fn: callback
	                };
	            } else {
	                return hook;
	            }
	        });
	    }

	    function resetDebug(id) {
	        var objAndProp = objectsAndPropsByDebugId[id];
	        var hooks = registry.get(objAndProp.obj)[objAndProp.prop].hooks;
	        for (var hookName in hooks) {
	            var hooksWithName = hooks[hookName];
	            hooks[hookName] = hooksWithName.filter(function (hook) {
	                return hook.id != id;
	            });
	        }

	        delete objectsAndPropsByDebugId[id];
	    }

	    function debuggerFunction() {
	        debugger;
	    }
	    debuggerFunction.callbackType = "debugger";

	    function getPropertyDescriptor(object, propertyName) {
	        try {
	            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
	        } catch (err) {
	            console.log("are you sure the property ", propertyName, " exists?");
	            throw err;
	        }
	        if (!object) {
	            throw new Error("Descriptor " + propertyName + " not found");
	        }
	        if (!descriptor) {
	            return getPropertyDescriptor(Object.getPrototypeOf(object), propertyName);
	        }
	        return descriptor;
	    }

	    function debugCall(object, prop, callback) {
	        callback = getCallbackFromUserFriendlyCallbackArgument(callback, object, prop, "call");

	        return debugObj(object, prop, {
	            propertyCallBefore: callback
	        });
	    }

	    var debugPropertyGet = function debugPropertyGet(object, propertyName, callback) {
	        return debugObj(object, propertyName, {
	            propertyGetBefore: callback
	        });
	    };
	    var debugPropertySet = function debugPropertySet(object, propertyName, callback) {
	        return debugObj(object, propertyName, {
	            propertySetBefore: callback
	        });
	    };

	    var registeredBreakpoints = [];

	    function pushRegisteredBreakpointsToExtension() {
	        var event = new CustomEvent("RebroadcastExtensionMessage", {
	            type: "updateRegisteredBreakpoints",
	            registeredBreakpoints: registeredBreakpoints
	        });
	        window.dispatchEvent(event);
	    }

	    pushRegisteredBreakpointsToExtension();

	    function getCallbackFromUserFriendlyCallbackArgument(callback, object, propertyName, accessType) {
	        if (typeof callback === "function") {
	            callback.callbackType = "custom";
	            return callback;
	        } else if (typeof callback === "string") {
	            if (callback === "debugger") {
	                return debuggerFunction;
	            } else if (callback === "trace") {
	                return getTraceFunction(object, propertyName, accessType);
	            } else {
	                throw new Error("Invalid string callback");
	            }
	        } else if (typeof callback === "undefined") {
	            return debuggerFunction;
	        } else {
	            throw new Error("Invalid callback type");
	        }
	    }

	    function getTraceFunction(object, propertyName, accessType) {
	        var traceFn = function traceFn() {
	            console.trace("About to " + accessType + " property '" + propertyName + "' on this object: ", object);
	        };
	        traceFn.callbackType = "trace";
	        return traceFn;
	    }

	    function getCallbackFromBreakpointDetails(details, object, propertyName) {
	        if (details.type === "debugger") {
	            return debuggerFunction;
	        } else if (details.type === "trace") {
	            return function () {
	                var traceMessage = details.traceMessage;
	                if (traceMessage !== undefined) {
	                    console.trace(details.traceMessage);
	                } else {
	                    var traceFn = getTraceFunction(object, propertyName, details.accessType);
	                    traceFn();
	                }
	            };
	        } else {
	            throw new Error("Invalid breakpoint type");
	        }
	    }

	    window.breakpoints = {
	        debugPropertyGet: function debugPropertyGet(obj, prop, callback) {
	            callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "get");
	            window.breakpoints.__internal.registerBreakpoint(function (debugPropertyGet, debugPropertySet, debugCall) {
	                debugPropertyGet(obj, prop, callback);
	            }, {
	                title: "debugPropertyGet (" + prop + ")",
	                type: callback.callbackType,
	                accessType: "get"
	            });
	        },
	        debugPropertySet: function debugPropertySet(obj, prop, callback) {
	            callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "set");
	            window.breakpoints.__internal.registerBreakpoint(function (debugPropertyGet, debugPropertySet, debugCall) {
	                debugPropertySet(obj, prop, callback);
	            }, {
	                title: "debugPropertySet (" + prop + ")",
	                type: callback.callbackType,
	                accessType: "set"
	            });
	        },
	        debugPropertyCall: function debugPropertyCall(obj, prop, callback) {
	            callback = getCallbackFromUserFriendlyCallbackArgument(callback, obj, prop, "call");
	            window.breakpoints.__internal.registerBreakpoint(function (debugPropertyGet, debugPropertySet, debugCall) {
	                debugCall(obj, prop, callback);
	            }, {
	                title: "debugPropertyCall (" + prop + ")",
	                type: callback.callbackType,
	                accessType: "call"
	            });
	        },
	        reset: function reset(id) {
	            resetDebug(id);
	        },
	        __internal: {
	            debug: {
	                _registry: registry,
	                _debugObj: debugObj,
	                _objectsAndPropsByDebugId: objectsAndPropsByDebugId,
	                _registeredBreakpoints: registeredBreakpoints
	            },
	            registerBreakpoint: function registerBreakpoint(fn, bpDetails, fixedCallback) {
	                var debugIds = [];
	                var _debugPropertyGet = function _debugPropertyGet(object, propertyName, callback) {
	                    if (fixedCallback) {
	                        callback = fixedCallback;
	                    }
	                    debugIds.push(debugPropertyGet(object, propertyName, callback));
	                };
	                var _debugPropertySet = function _debugPropertySet(object, propertyName, callback) {
	                    if (fixedCallback) {
	                        callback = fixedCallback;
	                    }
	                    debugIds.push(debugPropertySet(object, propertyName, callback));
	                };
	                var _debugCall = function _debugCall(object, propertyName, callback) {
	                    if (fixedCallback) {
	                        callback = fixedCallback;
	                    }
	                    debugIds.push(debugCall(object, propertyName, callback));
	                };
	                fn(_debugPropertyGet, _debugPropertySet, _debugCall);
	                var id = Math.floor(Math.random() * 1000000000);
	                registeredBreakpoints.push({
	                    id: id,
	                    debugIds: debugIds,
	                    details: bpDetails
	                });

	                pushRegisteredBreakpointsToExtension();
	            },
	            createSpecificBreakpoint: function createSpecificBreakpoint(breakpointName) {
	                window.breakpoints[breakpointName]();
	            },
	            registerBreakpointFromExtension: function registerBreakpointFromExtension(fn, bpDetails) {
	                var fixedCallback = getCallbackFromBreakpointDetails(bpDetails);
	                var id = window.breakpoints.__internal.registerBreakpoint(fn, bpDetails, fixedCallback);
	            },
	            getRegisteredBreakpoints: function getRegisteredBreakpoints() {
	                return registeredBreakpoints;
	            },
	            disableBreakpoint: function disableBreakpoint(id) {
	                var bp = registeredBreakpoints.filter(function (bp) {
	                    return bp.id == id;
	                })[0];
	                bp.debugIds.forEach(function (debugId) {
	                    resetDebug(debugId);
	                });
	                registeredBreakpoints = registeredBreakpoints.filter(function (bp) {
	                    return bp.id != id;
	                });

	                pushRegisteredBreakpointsToExtension();
	            },
	            updateBreakpoint: function updateBreakpoint(id, details) {
	                var bp = registeredBreakpoints.filter(function (bp) {
	                    return bp.id == id;
	                })[0];

	                bp.debugIds.forEach(function (debugId) {
	                    var objAndProp = objectsAndPropsByDebugId[debugId];
	                    var object = objAndProp.obj;
	                    var propertyName = objAndProp.prop;
	                    var callback = getCallbackFromBreakpointDetails(details, object, propertyName);
	                    updateDebugIdCallback(debugId, callback);
	                });

	                bp.details = details;

	                pushRegisteredBreakpointsToExtension();
	            }
	        }
	    };

	    var breakpoints = [{
	        title: "debugCookieReads",
	        debugPropertyGets: [{
	            obj: "document",
	            prop: "cookie"
	        }],
	        traceMessage: "About to read cookie contents"
	    }, {
	        title: "debugCookieWrites",
	        debugPropertySets: [{
	            obj: "document",
	            prop: "cookie"
	        }],
	        traceMessage: "About to update cookie contents"
	    }, {
	        title: "debugAlertCalls",
	        debugCalls: [{
	            obj: "window",
	            prop: "alert"
	        }],
	        traceMessage: "About to show alert box"
	    }, {
	        title: "debugConsoleErrorCalls",
	        debugCalls: [{
	            obj: "window.console",
	            prop: "error"
	        }],
	        traceMessage: "About to call console.error"
	    }, {
	        title: "debugConsoleLogCalls",
	        debugCalls: [{
	            obj: "window.console",
	            prop: "log"
	        }],
	        traceMessage: "About to call console.log"
	    }, {
	        title: "debugScroll",
	        debugCalls: [{
	            obj: "window",
	            prop: "scrollTo"
	        }, {
	            obj: "window",
	            prop: "scrollBy"
	        }],
	        debugPropertySets: [{
	            obj: "document.body",
	            prop: "scrollTop"
	        }, {
	            obj: "document.body",
	            prop: "scrollLeft"
	        }, {
	            obj: "Element.prototype",
	            prop: "scrollTop"
	        }, {
	            obj: "Element.prototype",
	            prop: "scrollLeft"
	        }],
	        traceMessage: "About to change body scroll position"
	    }, {
	        title: "debugLocalStorageReads",
	        debugCalls: [{
	            obj: "window.localStorage",
	            prop: "getItem"
	        }],
	        traceMessage: "About to read localStorage data"
	    }, {
	        title: "debugLocalStorageWrites",
	        debugCalls: [{
	            obj: "window.localStorage",
	            prop: "setItem"
	        }, {
	            obj: "window.localStorage",
	            prop: "clear"
	        }],
	        traceMessage: "About to write localStorage data"
	    }];
	    breakpoints.forEach(function (breakpoint) {

	        window.breakpoints[breakpoint.title] = function (callback) {
	            callback = getCallbackFromUserFriendlyCallbackArgument(callback);

	            var details = {
	                title: breakpoint.title,
	                traceMessage: breakpoint.traceMessage,
	                type: callback.callbackType
	            };

	            var fn = function fn(debugPropertyGet, debugPropertySet, debugPropertyCall) {
	                if (breakpoint.debugPropertyGets) {
	                    breakpoint.debugPropertyGets.forEach(function (property) {
	                        debugPropertyGet(eval(property.obj), property.prop, callback);
	                    });
	                }
	                if (breakpoint.debugPropertySets) {
	                    breakpoint.debugPropertySets.forEach(function (property) {
	                        debugPropertySet(eval(property.obj), property.prop, callback);
	                    });
	                }
	                if (breakpoint.debugCalls) {
	                    breakpoint.debugCalls.forEach(function (property) {
	                        debugPropertyCall(eval(property.obj), property.prop, callback);
	                    });
	                }
	            };

	            window.breakpoints.__internal.registerBreakpoint(fn, details);
	        };
	    });
	})();

/***/ }
/******/ ]);