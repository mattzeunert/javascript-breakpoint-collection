import React from "react"

var log = function(){}

var registeredBreakpoints = [];
var breakpoints = [
    {
        title: "debugCookieReads",
        debugPropertyGets: [{
            obj: "document",
            prop: "cookie"
        }],
        traceMessage: "About to read cookie contents"
    },
    {
        title: "debugCookieWrites",
        debugPropertySets: [{
            obj: "document",
            prop: "cookie"
        }],
        traceMessage: "About to update cookie contents"
    },
    {
        title: "debugAlertCalls",
        debugCalls: [{
            obj: "window",
            prop: "alert"
        }],
        traceMessage: "About to show alert box"
    },
    {
        title: "debugConsoleErrorCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "error"
        }],
        traceMessage: "About to call console.error"
    },
    {
        title: "debugConsoleLogCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "log"
        }],
        traceMessage: "About to call console.log"
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
        }],
        traceMessage: "About to change body scroll position"
    },
    {
        title:  "debugLocalStorageReads",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "getItem"
        }],
        traceMessage: "About to read localStorage data"
    },
    {
        title:  "debugLocalStorageWrites",
        debugCalls: [{
            obj: "window.localStorage",
            prop: "setItem"
        }],
        traceMessage: "About to write localStorage data"
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
        var customOption = null;
        if (this.props.breakpoint.details.type === "custom") {
            customOption = <option value="custom">custom</option>
        }

        return <div className="activated-breakpiont-list-item">
            {this.props.breakpoint.details.title}
            <button
                className="delete" 
                onClick={() => deactivateBreakpoint(this.props.breakpoint)}>
                &times;
            </button>
            <div style={{marginTop: 4}}>
                <select
                    value={this.props.breakpoint.details.type}
                    onChange={(event) => updateBreakpoint(this.props.breakpoint, event.target.value)}>
                    <option value="debugger">debugger</option>
                    <option value="trace">trace</option>
                    {customOption}
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
            type: "debugger"
        }
    }


    var calls = [];
    var {debugPropertyGets, debugPropertySets, debugCalls} = breakpoint;
    if (debugPropertyGets) {
        debugPropertyGets.forEach(function(property){
            calls.push(["debugPropertyGet", property.obj, property.prop])
        })
    }
    if (debugPropertySets) {
        debugPropertySets.forEach(function(property){
            calls.push(["debugPropertySet", property.obj, property.prop])
        })
    }
    if (debugCalls) {
        debugCalls.forEach(function(property){
            calls.push(["debugCall", property.obj, property.prop])
        })
    }

    var code = "(function(){ var fn = function(debugPropertyGet, debugPropertySet, debugCall){";

    calls.forEach(function(call){
        var [method, objName, propName] = call;
        code += method + '(' + objName + ',"' + propName + '");';
    })
    
    code += "};"
    var details = {
        title: breakpoint.title,
        traceMessage: breakpoint.traceMessage,
        type: options.type
    }
    code += "breakpoints.__internal.registerBreakpointFromExtension(fn, " + JSON.stringify(details) + ");";
    code += "})();"
    log("eval code", code)
    chrome.devtools.inspectedWindow.eval(code, function(){
        log("done eval activate code", arguments)
        app.update();
    });
}

function deactivateBreakpoint(breakpoint) {
    var code = "breakpoints.__internal.disableBreakpoint(" + breakpoint.id + ");"
    log("eval deactivate", code)
    chrome.devtools.inspectedWindow.eval(code, function(){
        app.update();
    })   
}

function updateBreakpoint(breakpoint, traceOrDebugger){
    var id = breakpoint.id;
    var details = Object.assign({}, breakpoint.details);
    details.type = traceOrDebugger;
    var code = "breakpoints.__internal.updateBreakpoint('"+ id + "', " + JSON.stringify(details) + ");"
    chrome.devtools.inspectedWindow.eval(code, function(regBp){
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