chrome.devtools.panels.create("Breakpoints",
    null,
    "panel.html",
    function(panel) {

      // code invoked on panel creation
    }
);

chrome.devtools.network.onNavigated.addListener(installBreakpointsObject)

installBreakpointsObject();

function installBreakpointsObject(){


    chrome.devtools.inspectedWindow.eval(`
    (function(){

        function debuggerFunction(){
            debugger;
        }
        
        function getPropertyDescriptor(object, propertyName){
            var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
            if (!object){
                throw new Error("Descriptor " + propertyName + " not found");
            }
            if (!descriptor) {
                return getPropertyDescriptor(Object.getPrototypeOf(object), propertyName);
            }
            return descriptor;
        }

        function debugPropertyAccess(object, prop, options){
            var before = options.before;
            var after = options.after;

            var originalProp = getPropertyDescriptor(object, prop);
            var isSimpleValue = "value" in originalProp; // rather than getter + setter

            Object.defineProperty(object, prop, {
                get: function(){
                    var retVal;
                    before("get");
                    if (isSimpleValue) {
                        retVal = originalProp.value;
                    } else {
                        retVal = originalProp.get.apply(this, arguments);    
                    }
                    after("get");
                    return retVal;
                },
                set: function(newValue){
                    var retVal;
                    before("set");
                    if (isSimpleValue) {
                        retVal = originalProp.value = newValue;
                    } else {
                        retVal = originalProp.set.apply(this, arguments);
                    }
                    after("set");
                    return retVal;
                }
            });
        }

        function createPropertyAccessTypeDebugFunction(accessTypeToDebug) {
            return function(object, prop, options){
                var before, after;
                if (options === undefined) {
                    before = debuggerFunction;
                }
                else {
                    before = options.before;
                    after = options.after;
                }
                debugPropertyAccess(object, prop, {
                    before: function(accessType){
                        if (accessTypeToDebug === accessType) {
                            if (before) {
                                before.apply(this, arguments)
                            }
                        }
                    },
                    after: function(accessType){
                        if (accessTypeToDebug === accessType) {
                            if (after) {
                                after.apply(this, arguments)
                            }
                        }
                    }
                })
            }
        }

        function debugCall(object, prop, options){
            var before, after;
            if (options === undefined) {
                before = debuggerFunction;
            } else if (typeof options === "function") {
                before = options;
            } else {
                before = options.before;
                after = options.after;
            }

            var originalFunction = object[prop];
            object[prop] = function(){
                if (before) {
                    before();
                }
                var retVal = originalFunction();
                if (after) {
                    after();
                }
                return retVal
            }
        }

        window.breakpoints = {
            debugPropertyAccess,
            debugPropertyGet: createPropertyAccessTypeDebugFunction("get"),
            debugPropertySet: createPropertyAccessTypeDebugFunction("set"),
            debugCall
        }
    })();
    `)
}