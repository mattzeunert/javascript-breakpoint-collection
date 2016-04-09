import React from "react"

var log = function(){}

var registeredBreakpoints = [];
var breakpoints = [
    {
        title: "debugCookieReads",
        debugPropertyGets: [{
            obj: "document",
            prop: "cookie"
        }]
    },
    {
        title: "debugCookieWrites",
        debugPropertySets: [{
            obj: "document",
            prop: "cookie"
        }]
    },
    {
        title: "debugAlertCalls",
        debugCalls: [{
            obj: "window",
            prop: "alert"
        }]
    },
    {
        title: "debugConsoleErrorCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "error"
        }]
    },
    {
        title: "debugConsoleLogCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "log"
        }]
    },
    {
        title: "debugPageScroll",
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
        }]
    },
    {
        title:  "debugLocalStorageReads",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "getItem"
        }]
    }
]

class UnactivatedBreakpointListItem extends React.Component {
    render(){
        return <div onClick={()=>this.props.onClick()}
            className="unactivated-breakpoint-list-item">
            {this.props.breakpoint.title}
            <div className="plus">+</div>
        </div>
    }
}

class UnactivatedBreakpointList extends React.Component {
    render(){
        return <div>
            {this.props.breakpoints.map(
                (bp) => <UnactivatedBreakpointListItem
                    key={bp.title}
                    onClick={() => activateBreakpoint(bp)}
                    breakpoint={bp} />
            )}
        </div>
    }
}

class ActivatedBreakpointListItem extends React.Component {
    render(){
        return <div className="activated-breakpiont-list-item">
            {this.props.breakpoint.details.title}
            <button
                className="delete" 
                onClick={() => deactivateBreakpoint(this.props.breakpoint)}>
                &times;
            </button>
            <div style={{marginTop: 4}}>
                <select
                    value={this.props.breakpoint.details.hookType}
                    onChange={(event) => updateBreakpoint(this.props.breakpoint, event.target.value)}>
                    <option value="debugger">debugger</option>
                    <option value="trace">trace</option>
                </select>
            </div>
        </div>
    }
}

class ActivatedBreakpointList extends React.Component {
    render(){
        if (this.props.breakpoints.length === 0) {
            return <div>
                Click on a breakpoint on the left to activate it.
            </div>
        }
        return <div>
            {this.props.breakpoints.map(bp => 
                <ActivatedBreakpointListItem key={bp.title} breakpoint={bp} />
            )}
        </div>
    }
}



function activateBreakpoint(breakpoint, options){
    if (!options) {
        options = {
            hookType: "debugger"
        }
    }
    var hookType = options.hookType;


    var calls = [];
    var {debugPropertyGets, debugPropertySets, debugCalls} = breakpoint;
    if (debugPropertyGets) {
        debugPropertyGets.forEach(function(property){
            calls.push(["debugPropertyGet", property.obj, property.prop, hookType])
        })
    }
    if (debugPropertySets) {
        debugPropertySets.forEach(function(property){
            calls.push(["debugPropertySet", property.obj, property.prop, hookType])
        })
    }
    if (debugCalls) {
        debugCalls.forEach(function(property){
            calls.push(["debugCall", property.obj, property.prop, hookType])
        })
    }

    var code = "(function(){ var fn = function(debugPropertyGet, debugPropertySet, debugCall){";

    calls.forEach(function(call){
        var [method, objName, propName, hookType] = call;
        code += method + '(' + objName + ',"' + propName + '", "' + hookType + '");';
    })
    
    code += "};"
    var details = {
        title: breakpoint.title,
        hookType: hookType
    }
    code += "breakpoints.__internal.registerBreakpoint(fn, " + JSON.stringify(details) + ");";
    code += "return breakpoints.__internal.getRegisteredBreakpoints();"
    code += "})();"
    log("eval code", code)
    chrome.devtools.inspectedWindow.eval(code, function(regBp){
        log("done eval activate code", arguments)
        registeredBreakpoints = regBp
        app.update();
    });
}

function deactivateBreakpoint(breakpoint) {
    var code = "breakpoints.__internal.disableBreakpoint(" + breakpoint.id + ");";
    code += "breakpoints.__internal.getRegisteredBreakpoints();"
    log("eval deactivate", code)
    chrome.devtools.inspectedWindow.eval(code, function(regBp){
        registeredBreakpoints = regBp;
        app.update();
    })   
}

function updateBreakpoint(breakpoint, traceOrDebugger){
    var id = breakpoint.id;
    log("updateBreakpoint", traceOrDebugger)
    var settings = {
        hookType: traceOrDebugger
    }
    var details = Object.assign({}, breakpoint.details);
    details.hookType = traceOrDebugger;
    var code = "breakpoints.__internal.updateBreakpoint('"+ id + "', " + JSON.stringify(settings) + "," + JSON.stringify(details) + ");"
    code += "breakpoints.__internal.getRegisteredBreakpoints();"
    chrome.devtools.inspectedWindow.eval(code, function(regBp){
        registeredBreakpoints = regBp;
        app.update();
    })
}

var app = null;

readBreakpointsFromPage();

function readBreakpointsFromPage(){
    chrome.devtools.inspectedWindow.eval("breakpoints.__internal.getRegisteredBreakpoints();", function(regBp){
        log("after fetch initial state", arguments)
        log("setting regbp to ", regBp)
        registeredBreakpoints = regBp;
        app.update();
    });
}

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
    log(arguments, "ssss")
    readBreakpointsFromPage();
});

// Relay the tab ID to the background page
// chrome.runtime.sendMessage({
//     tabId: chrome.devtools.inspectedWindow.tabId,
//     scriptToInject: "content-script.js"
// });




export default class App extends React.Component {
    componentDidMount(){
        app = this;
    }
    render(){
        return <div className="col-parent">
            <div>
                <div>
                    <u>JavaScript Breakpoint Collection</u>
                </div>
                <p>
                    Click on a breakpoint on the right to add it.
                </p>
                <p>
                    To debug property access and function calls on arbitray objects use the code below.
                </p>
                <div style={{maxWidth: "100%", "overflow": "auto"}}>
                    <pre>
                        breakpoints.debugPropertySet(document, "cookie");
                    </pre>
                    <pre>
                        breakpoints.debugPropertyGet(document, "cookie");
                    </pre>
                    <pre>
                        breakpoints.debugPropertyCall(localStorage, "setItem");
                    </pre>
                </div>
            </div>
            <div>
                <h2>Breakpoints</h2>
                <UnactivatedBreakpointList breakpoints={breakpoints} />
            </div>
            <div>
                <h2>Activated Breakpoints</h2>
                <ActivatedBreakpointList breakpoints={registeredBreakpoints} />
            </div>
        </div>

    }
    update(){
        log("update")
        this.setState({sth: Math.random()})
    }
}