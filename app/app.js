import predefinedBreakpoints from "../breakpoints/predefinedBreakpoints"

var appState = {
    registeredBreakpoints: [],
    predefinedBreakpoints
}

export function activateBreakpoint(breakpoint, options){
    var code = "window.breakpoints." + breakpoint.title + "('trace')"
    evalInInspectedWindow(code);
}

export function deactivateBreakpoint(breakpoint) {
    var code = "window.breakpoints.__internal.disableBreakpoint(" + breakpoint.id + ");"
    evalInInspectedWindow(code);
}

export function updateBreakpointType(breakpoint, traceOrDebugger){
    var id = breakpoint.id;
    var code = "window.breakpoints.__internal.updateBreakpointType('"+ id + "', '" + traceOrDebugger + "');"
    evalInInspectedWindow(code)
}

export function setTypeOfMostRecentBreakpointToDebugger(){
    evalInInspectedWindow("breakpoints.__internal.setTypeOfMostRecentBreakpointToDebugger()")
}

function checkIfBreakpointsInstalledOnPage(callback) {
    evalInInspectedWindow("window.breakpoints !== undefined", function(result){
        callback(result);
    })
}


function evalInInspectedWindow(code, callback){
    chrome.devtools.inspectedWindow.eval(code, function(result, err){
        if (err && err.isException) {
            console.log("Exception occured in eval'd code", err.value)
        }
        else {
            if (callback) {
                callback(result);
            }
        }
    });
}

function readBreakpointsFromPage(){
    evalInInspectedWindow("breakpoints.__internal.getRegisteredBreakpoints();", function(regBp){
        appState.registeredBreakpoints = regBp;
        updateApp();
    });
}

function installBreakpointsOnPage(callback){
    var src = chrome.extension.getURL('build/javascript-breakpoint-collection.js');
    var code = `
        var s = document.createElement('script');
        s.src = '${src}'
        s.onload = function() {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(s);
    `;
    evalInInspectedWindow(code, callback);
}

checkIfBreakpointsInstalledOnPage(function(isInstalled){
    if (isInstalled) {
        readBreakpointsFromPage();
    } else {
        installBreakpointsOnPage(function(){
            readBreakpointsFromPage();
        })
    }
})

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // console.log("readBreakpointsFromPage b/c bg page said so")
    readBreakpointsFromPage();
});



var appViews = [];
export function registerAppView(appView){
    appViews.push(appView)
}
function updateApp(){
    appViews.forEach(function(appView){
        appView.update()
    })
}

export {appState}