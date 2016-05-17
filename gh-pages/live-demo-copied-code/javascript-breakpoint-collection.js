(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _consoleInterface = __webpack_require__(165);
	
	var _consoleInterface2 = _interopRequireDefault(_consoleInterface);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = _consoleInterface2.default;
	var isInBrowser = typeof window !== "undefined";
	if (isInBrowser) {
	    if (window.breakpoints !== undefined) {
	        if (!window.breakpoints.__internal || !window.breakpoints.__internal.isBreakpointCollectionExtension) {
	            console.log("Breakpoints extension can't load, global `breakpoints` variable is already defined");
	        }
	    } else {
	        window.breakpoints = _consoleInterface2.default;
	
	        (0, _consoleInterface.pushRegisteredBreakpointsToExtension)();
	    }
	}

/***/ },

/***/ 161:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = [{
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
	    getTraceInfo: function getTraceInfo(details) {
	        if (details.propertyName == "scrollTo" || details.propertyName == "scrollBy") {
	            return ["The scroll position of the window was changed by a window." + details.propertyName + " call with", details.callArguments];
	        }
	        return ["The scroll position of", details.thisArgument, "was changed by setting the " + details.propertyName + " property to " + details.newPropertyValue];
	    }
	}, {
	    title: "debugCookieReads",
	    debugPropertyGets: [{
	        obj: "document",
	        prop: "cookie"
	    }],
	    traceMessage: "Reading cookie contents"
	}, {
	    title: "debugCookieWrites",
	    debugPropertySets: [{
	        obj: "document",
	        prop: "cookie"
	    }],
	    traceMessage: "Updating cookie contents"
	}, {
	    title: "debugAlertCalls",
	    debugCalls: [{
	        obj: "window",
	        prop: "alert"
	    }],
	    traceMessage: "Showing alert box"
	}, {
	    title: "debugElementSelection",
	    debugCalls: [{
	        obj: "document",
	        prop: "getElementById"
	    }, {
	        obj: "document",
	        prop: "getElementsByClassName"
	    }, {
	        obj: "document",
	        prop: "getElementsByName"
	    }, {
	        obj: "document",
	        prop: "getElementsByTagName"
	    }, {
	        obj: "document",
	        prop: "getElementsByTagNameNS"
	    }, {
	        obj: "document",
	        prop: "getElementsByClassName"
	    }, {
	        obj: "document",
	        prop: "querySelector"
	    }, {
	        obj: "document",
	        prop: "querySelectorAll"
	    }, {
	        obj: "document",
	        prop: "evaluate" // xpath
	    }],
	    getTraceInfo: function getTraceInfo(details) {
	        return ["Selecting DOM elements \"" + details.callArguments[0] + "\" using " + details.propertyName];
	    }
	}, {
	    title: "debugConsoleErrorCalls",
	    debugCalls: [{
	        obj: "window.console",
	        prop: "error"
	    }],
	    traceMessage: "Calling console.error"
	}, {
	    title: "debugConsoleLogCalls",
	    debugCalls: [{
	        obj: "window.console",
	        prop: "log"
	    }],
	    traceMessage: "Calling console.log"
	}, {
	    title: "debugConsoleTraceCalls",
	    debugCalls: [{
	        obj: "window.console",
	        prop: "trace"
	    }],
	    traceMessage: "Calling console.trace"
	}, {
	    title: "debugMathRandom",
	    debugCalls: [{
	        obj: "window.Math",
	        prop: "random"
	    }],
	    getTraceInfo: function getTraceInfo() {
	        return ["Calling Math.random"];
	    }
	}, {
	    title: "debugTimerCreation",
	    debugCalls: [{
	        obj: "window",
	        prop: "setTimeout"
	    }, {
	        obj: "window",
	        prop: "setInterval"
	    }],
	    getTraceInfo: function getTraceInfo(details) {
	        return ["Creating timer using " + details.propertyName];
	    }
	}, {
	    title: "debugLocalStorageReads",
	    debugCalls: [{
	        obj: "window.localStorage",
	        prop: "getItem"
	    }],
	    getTraceInfo: function getTraceInfo(details) {
	        return ["Reading localStorage data for key \"" + details.callArguments[0] + "\""];
	    }
	}, {
	    title: "debugLocalStorageWrites",
	    debugCalls: [{
	        obj: "window.localStorage",
	        prop: "setItem"
	    }, {
	        obj: "window.localStorage",
	        prop: "clear"
	    }],
	    getTraceInfo: function getTraceInfo(details) {
	        if (details.propertyName == "clear") {
	            return ["Clearing all localStorage data"];
	        }
	        return ["Writing localStorage data for key \"" + details.callArguments[0] + "\""];
	    }
	}];

/***/ },

/***/ 165:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.pushRegisteredBreakpointsToExtension = undefined;
	
	var _debugObj = __webpack_require__(166);
	
	var _debugObj2 = _interopRequireDefault(_debugObj);
	
	var _predefinedBreakpoints = __webpack_require__(161);
	
	var _predefinedBreakpoints2 = _interopRequireDefault(_predefinedBreakpoints);
	
	var _getCallbackFromUserFriendlyCallbackArgument = __webpack_require__(167);
	
	var _getCallbackFromUserFriendlyCallbackArgument2 = _interopRequireDefault(_getCallbackFromUserFriendlyCallbackArgument);
	
	var _breakpointCombinations = __webpack_require__(168);
	
	var _breakpointCombinations2 = _interopRequireDefault(_breakpointCombinations);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function pushRegisteredBreakpointsToExtension() {
	    if (typeof CustomEvent === "undefined" || typeof window === "undefined" || !window.dispatchEvent) {
	        return; // probably in a Node environment
	    }
	    var event = new CustomEvent("RebroadcastExtensionMessage", {
	        type: "updateRegisteredBreakpoints",
	        registeredBreakpoints: _breakpointCombinations2.default.getRegisteredBreakpoints()
	    });
	    window.dispatchEvent(event);
	}
	
	var __internal = {
	    updateBreakpointType: function updateBreakpointType(id, newType) {
	        _breakpointCombinations2.default.updateType(id, newType);
	        pushRegisteredBreakpointsToExtension();
	    },
	    disableBreakpoint: function disableBreakpoint(id) {
	        _breakpointCombinations2.default.disable(id);
	        pushRegisteredBreakpointsToExtension();
	    },
	    registerBreakpoint: function registerBreakpoint() {
	        var id = _breakpointCombinations2.default.register.apply(null, arguments);
	        pushRegisteredBreakpointsToExtension();
	        return id;
	    },
	    isBreakpointCollectionExtension: true,
	    debug: {
	        debugObj: _debugObj2.default,
	        debugObjBreakpointRegistry: _debugObj.debugObjBreakpointRegistry,
	        objectsAndPropsByDebugId: _debugObj.objectsAndPropsByDebugId
	    },
	    getRegisteredBreakpoints: function getRegisteredBreakpoints() {
	        return _breakpointCombinations2.default.getRegisteredBreakpoints();
	    },
	    setTypeOfMostRecentBreakpointToDebugger: function setTypeOfMostRecentBreakpointToDebugger() {
	        _breakpointCombinations2.default.setTypeOfMostRecentBreakpointToDebugger();
	        pushRegisteredBreakpointsToExtension();
	    }
	};
	
	(0, _debugObj.disableBreakpointsDuringAllFunctionCalls)(__internal);
	
	function publicDebugPropertyAccess(obj, prop, callback, accessType) {
	    var functionName = {
	        "get": "debugPropertyGet",
	        "set": "debugPropertySet",
	        "call": "debugPropertyCall"
	    }[accessType];
	
	    callback = (0, _getCallbackFromUserFriendlyCallbackArgument2.default)(callback);
	    __internal.registerBreakpoint(function (debugPropertyGet, debugPropertySet, debugPropertyCall) {
	        var debugFunctions = {
	            debugPropertyGet: debugPropertyGet,
	            debugPropertySet: debugPropertySet,
	            debugPropertyCall: debugPropertyCall
	        };
	        debugFunctions[functionName](obj, prop, callback);
	    }, {
	        title: functionName + " (" + prop + ")",
	        type: callback.callbackType
	    });
	}
	
	var breakpoints = {
	    debugPropertyGet: function debugPropertyGet(obj, prop, callback) {
	        return publicDebugPropertyAccess(obj, prop, callback, "get");
	    },
	    debugPropertySet: function debugPropertySet(obj, prop, callback) {
	        return publicDebugPropertyAccess(obj, prop, callback, "set");
	    },
	    debugPropertyCall: function debugPropertyCall(obj, prop, callback) {
	        return publicDebugPropertyAccess(obj, prop, callback, "call");
	    },
	    resetAllBreakpoints: function resetAllBreakpoints() {
	        _breakpointCombinations2.default.resetAll();
	        pushRegisteredBreakpointsToExtension();
	    },
	    resetLastBreakpoint: function resetLastBreakpoint() {
	        if (_breakpointCombinations2.default.getRegisteredBreakpoints().length === 0) {
	            console.log("No breakpoints are currently registered");
	            return;
	        }
	        _breakpointCombinations2.default.resetLastBreakpoint();
	        pushRegisteredBreakpointsToExtension();
	    },
	    __internal: __internal
	};
	
	_predefinedBreakpoints2.default.forEach(function (breakpoint) {
	    breakpoints[breakpoint.title] = function (callback) {
	        callback = (0, _getCallbackFromUserFriendlyCallbackArgument2.default)(callback, breakpoint);
	
	        var details = {
	            title: breakpoint.title,
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
	
	        var resetFn = __internal.registerBreakpoint(fn, details, breakpoint);
	        pushRegisteredBreakpointsToExtension();
	        return resetFn;
	    };
	});
	
	(0, _debugObj.disableBreakpointsDuringAllFunctionCalls)(breakpoints);
	
	exports.default = breakpoints;
	exports.pushRegisteredBreakpointsToExtension = pushRegisteredBreakpointsToExtension;

/***/ },

/***/ 166:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.runWithBreakpointsDisabled = runWithBreakpointsDisabled;
	exports.disableBreakpointsDuringAllFunctionCalls = disableBreakpointsDuringAllFunctionCalls;
	exports.default = debugObj;
	exports.updateDebugIdCallback = updateDebugIdCallback;
	exports.resetDebug = resetDebug;
	var registry = new Map();
	var objectsAndPropsByDebugId = {};
	
	var hookNames = ["propertyGetBefore", "propertyGetAfter", "propertySetBefore", "propertySetAfter", "propertyCallBefore", "propertyCallAfter"];
	
	function getPropertyDescriptor(object, propertyName) {
	    try {
	        var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
	    } catch (err) {
	        var newError = Error("Are you sure the property \"" + propertyName + "\" exists?");
	        newError.originalError = err;
	        throw newError;
	    }
	    if (!object) {
	        throw new Error("Descriptor " + propertyName + " not found");
	    }
	    if (!descriptor) {
	        return getPropertyDescriptor(Object.getPrototypeOf(object), propertyName);
	    }
	    return descriptor;
	}
	
	exports.debugObjBreakpointRegistry = registry;
	exports.objectsAndPropsByDebugId = objectsAndPropsByDebugId;
	
	// counter instead of boolean to allow nested calls of runWithBreakpointsDisabled
	
	var timesBreakpointsWereDisabled = 0;
	function runWithBreakpointsDisabled(fn) {
	    timesBreakpointsWereDisabled++;
	    var retVal = fn();
	    timesBreakpointsWereDisabled--;
	    return retVal;
	}
	
	function disableBreakpointsDuringAllFunctionCalls(object) {
	    var _loop = function _loop() {
	        var fn = object[functionName];
	        if (typeof fn !== "function") {
	            return "continue";
	        }
	
	        object[functionName] = function () {
	            var thisArg = this;
	            var args = arguments;
	            return runWithBreakpointsDisabled(function () {
	                return fn.apply(thisArg, args);
	            });
	        };
	    };
	
	    for (var functionName in object) {
	        var _ret = _loop();
	
	        if (_ret === "continue") continue;
	    }
	}
	
	function areBreakpointsDisabled() {
	    return timesBreakpointsWereDisabled > 0;
	}
	
	function debugObj(obj, prop, hooks) {
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
	                    return function () {
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
	                    };
	                }
	
	                return retVal;
	            },
	            set: function set(newValue) {
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
	
	    hookNames.forEach(function (hookName) {
	        if (hooks[hookName] !== undefined) {
	            if (registry.get(obj)[prop].hooks[hookName] === undefined) {
	                registry.get(obj)[prop].hooks[hookName] = [];
	            }
	            var hook = hooks[hookName];
	            registry.get(obj)[prop].hooks[hookName].push({
	                id: debugId,
	                fn: hook.fn,
	                data: hook.data
	            });
	        }
	    });
	
	    return debugId;
	
	    function triggerHook(hookName, additionalHookInfo) {
	        if (areBreakpointsDisabled()) {
	            return;
	        }
	        var hooks = registry.get(obj)[prop].hooks;
	        var hooksWithName = hooks[hookName];
	
	        var infoForHook = _extends({
	            object: obj,
	            propertyName: prop
	        }, additionalHookInfo);
	
	        if (hooksWithName !== undefined && hooksWithName.length > 0) {
	            hooksWithName.forEach(function (hook) {
	                hook.fn(_extends({}, infoForHook, {
	                    accessType: getAccessTypeFromHookName(hookName),
	                    data: hook.data
	                }));
	            });
	        }
	    }
	}
	
	function getAccessTypeFromHookName(hookName) {
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
	
	function updateEachHook(obj, prop, cb) {
	    var hooks = registry.get(obj)[prop].hooks;
	    hookNames.forEach(function (hookName) {
	        var hooksWithName = hooks[hookName];
	        if (hooksWithName !== undefined) {
	            hooks[hookName] = hooksWithName.map(function (hook) {
	                return cb(hook);
	            });
	        }
	    });
	}
	
	function updateDebugIdCallback(debugId, callback) {
	    var objAndProp = objectsAndPropsByDebugId[debugId];
	    updateEachHook(objAndProp.obj, objAndProp.prop, function (hook) {
	        if (hook.id === debugId) {
	            return {
	                id: debugId,
	                fn: callback,
	                data: hook.data
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

/***/ },

/***/ 167:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.default = getCallbackFromUserFriendlyCallbackArgument;
	
	var _debugObj = __webpack_require__(166);
	
	function getDebuggerFunction() {
	    var debuggerFunc = function debuggerFunc() {
	        debugger;
	    };
	    debuggerFunc.callbackType = "debugger";
	    return debuggerFunc;
	}
	
	function getCallbackFromUserFriendlyCallbackArgument(callback, predefinedBreakpoint) {
	    if (typeof callback === "function") {
	        callback.callbackType = "custom";
	        return callback;
	    } else if (typeof callback === "string") {
	        if (callback === "debugger") {
	            return getDebuggerFunction();
	        } else if (callback === "trace") {
	            return getTraceFunction(predefinedBreakpoint);
	        } else {
	            throw new Error("Invalid string callback");
	        }
	    } else if (typeof callback === "undefined") {
	        return getDebuggerFunction();
	    } else {
	        throw new Error("Invalid callback type: " + (typeof callback === "undefined" ? "undefined" : _typeof(callback)));
	    }
	}
	
	function getTraceFunction(predefinedBreakpoint) {
	    var traceFn;
	    if (predefinedBreakpoint) {
	        if (predefinedBreakpoint.getTraceInfo) {
	            traceFn = function traceFn() {
	                var traceArgs = predefinedBreakpoint.getTraceInfo.apply(null, arguments);
	                (0, _debugObj.runWithBreakpointsDisabled)(function () {
	                    console.trace.apply(console, traceArgs);
	                });
	            };
	        } else if (predefinedBreakpoint.traceMessage) {
	            traceFn = function traceFn() {
	                (0, _debugObj.runWithBreakpointsDisabled)(function () {
	                    console.trace(predefinedBreakpoint.traceMessage);
	                });
	            };
	        }
	    } else {
	        traceFn = function traceFn(debugInfo) {
	            (0, _debugObj.runWithBreakpointsDisabled)(function () {
	                console.trace("About to " + debugInfo.accessType + " property '" + debugInfo.propertyName + "' on this object: ", debugInfo.object);
	            });
	        };
	    }
	
	    traceFn.callbackType = "trace";
	    return traceFn;
	}

/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _debugObj = __webpack_require__(166);
	
	var _debugObj2 = _interopRequireDefault(_debugObj);
	
	var _getCallbackFromUserFriendlyCallbackArgument = __webpack_require__(167);
	
	var _getCallbackFromUserFriendlyCallbackArgument2 = _interopRequireDefault(_getCallbackFromUserFriendlyCallbackArgument);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var registeredBreakpoints = [];
	
	function debugPropertyCall(object, prop, callback) {
	    return (0, _debugObj2.default)(object, prop, {
	        propertyCallBefore: {
	            fn: callback
	        }
	    });
	}
	
	var debugPropertyGet = function debugPropertyGet(object, propertyName, callback) {
	    return (0, _debugObj2.default)(object, propertyName, {
	        propertyGetBefore: {
	            fn: callback
	        }
	    });
	};
	var debugPropertySet = function debugPropertySet(object, propertyName, callback) {
	    return (0, _debugObj2.default)(object, propertyName, {
	        propertySetBefore: {
	            fn: callback
	        }
	    });
	};
	
	var breakpointCombinations = {
	    register: function register(fn, bpDetails, predefinedBreakpoint) {
	        var debugIds = [];
	        var _debugPropertyGet = function _debugPropertyGet(object, propertyName, callback) {
	            debugIds.push(debugPropertyGet(object, propertyName, callback));
	        };
	        var _debugPropertySet = function _debugPropertySet(object, propertyName, callback) {
	            debugIds.push(debugPropertySet(object, propertyName, callback));
	        };
	        var _debugPropertyCall = function _debugPropertyCall(object, propertyName, callback) {
	            debugIds.push(debugPropertyCall(object, propertyName, callback));
	        };
	        fn(_debugPropertyGet, _debugPropertySet, _debugPropertyCall);
	
	        var id = Math.floor(Math.random() * 1000000000);
	        var bp = {
	            id: id,
	            debugIds: debugIds,
	            details: bpDetails,
	            createdAt: new Date(),
	            predefinedBreakpoint: predefinedBreakpoint
	        };
	        registeredBreakpoints.push(bp);
	
	        return id;
	    },
	    disable: function disable(id) {
	        var bp = registeredBreakpoints.filter(function (bp) {
	            return bp.id == id;
	        })[0];
	        if (bp === undefined) {
	            console.log("Couldn't find breakpoint with id", id);
	            return;
	        }
	        bp.debugIds.forEach(function (debugId) {
	            (0, _debugObj.resetDebug)(debugId);
	        });
	        registeredBreakpoints = registeredBreakpoints.filter(function (bp) {
	            return bp.id != id;
	        });
	    },
	    updateType: function updateType(id, newType) {
	        if (newType !== "debugger" && newType !== "trace") {
	            throw new Error("Invalid breakpoint type");
	        }
	
	        var bp = registeredBreakpoints.filter(function (bp) {
	            return bp.id == id;
	        })[0];
	
	        var callback = (0, _getCallbackFromUserFriendlyCallbackArgument2.default)(newType, bp.predefinedBreakpoint);
	        bp.debugIds.forEach(function (debugId) {
	            (0, _debugObj.updateDebugIdCallback)(debugId, callback);
	        });
	
	        bp.details.type = newType;
	    },
	    resetAll: function resetAll() {
	        registeredBreakpoints.forEach(function (breakpoint) {
	            breakpointCombinations.disable(breakpoint.id);
	        });
	    },
	    getRegisteredBreakpoints: function getRegisteredBreakpoints() {
	        return registeredBreakpoints;
	    },
	    resetLastBreakpoint: function resetLastBreakpoint() {
	        var breakpointToReset = registeredBreakpoints[registeredBreakpoints.length - 1];
	        breakpointCombinations.disable(breakpointToReset.id);
	    },
	    setTypeOfMostRecentBreakpointToDebugger: function setTypeOfMostRecentBreakpointToDebugger() {
	        var mostRecentBreakpoint = registeredBreakpoints[registeredBreakpoints.length - 1];
	        breakpointCombinations.updateType(mostRecentBreakpoint.id, "debugger");
	    }
	};
	
	(0, _debugObj.disableBreakpointsDuringAllFunctionCalls)(breakpointCombinations);
	
	exports.default = breakpointCombinations;

/***/ }

/******/ })
});
;
//# sourceMappingURL=javascript-breakpoint-collection.js.map