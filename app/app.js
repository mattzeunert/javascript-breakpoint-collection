import predefinedBreakpoints from "../breakpoints/predefinedBreakpoints"

var appState = {
    registeredBreakpoints: [],
    predefinedBreakpoints
}

export function activateBreakpoint(breakpoint, options){
    var code = "window.breakpoints.__internal.createSpecificBreakpoint('" + breakpoint.title + "')"
    chrome.devtools.inspectedWindow.eval(code, function(){
        
    });
}

export function deactivateBreakpoint(breakpoint) {
    var code = "breakpoints.__internal.disableBreakpoint(" + breakpoint.id + ");"
    chrome.devtools.inspectedWindow.eval(code, function(){
        
    })   
}

export function updateBreakpoint(breakpoint, traceOrDebugger){
    var id = breakpoint.id;
    var details = Object.assign({}, breakpoint.details);
    details.type = traceOrDebugger;
    var code = "breakpoints.__internal.updateBreakpoint('"+ id + "', " + JSON.stringify(details) + ");"
    chrome.devtools.inspectedWindow.eval(code, function(regBp){
        
    })
}




readBreakpointsFromPage();

function evalInInspectedWindow(code, callback){
    chrome.devtools.inspectedWindow.eval(code, callback);
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