import predefinedBreakpoints from "../breakpoints/predefinedBreakpoints"

var appState = {
    registeredBreakpoints: [],
    predefinedBreakpoints
}

export function activateBreakpoint(breakpoint, options){
    var code = "window.breakpoints.__internal.createSpecificBreakpoint('" + breakpoint.title + "')"
    evalInInspectedWindow(code);
}

export function deactivateBreakpoint(breakpoint) {
    var code = "breakpoints.__internal.disableBreakpoint(" + breakpoint.id + ");"
    evalInInspectedWindow(code);
}

export function updateBreakpoint(breakpoint, traceOrDebugger){
    var id = breakpoint.id;
    var details = Object.assign({}, breakpoint.details);
    details.type = traceOrDebugger;
    var code = "breakpoints.__internal.updateBreakpoint('"+ id + "', " + JSON.stringify(details) + ");"
    evalInInspectedWindow(code, function(){
        
    })
}

export function setTypeOfMostRecentBreakpointToDebugger(){
    evalInInspectedWindow("breakpoints.__internal.setTypeOfMostRecentBreakpointToDebugger()")
}


readBreakpointsFromPage();

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