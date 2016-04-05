import React from "react"

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
        title: "debuAlertCalls",
        debugCalls: [{
            obj: "window",
            prop: "alert"
        }]
    },
    {
        title: "debugConsoleErrorCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "log"
        }]
    },
    {
        title: "debugConsoleLogCalls",
        debugCalls: [{
            obj: "window.console",
            prop: "log"
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
            {this.props.breakpoint.title}
            <button
                className="delete" 
                onClick={() => deactivateBreakpoint(this.props.breakpoint)}>
                x
            </button>
            <select
                value={this.props.breakpoint.hookType}
                onChange={(event) => updateBreakpoint(this.props.breakpoint, event.target.value)}>
                <option value="debugger">debugger</option>
                <option value="trace">trace</option>
            </select>
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

function getActivatedBreakpoints(){
    return breakpoints.filter(bp => bp.activated);
}
function getUnactivatedBreakpoints(){
    return breakpoints.filter(bp => !bp.activated);
}

function activateBreakpoint(breakpoint, options){
    if (!options) {
        options = {
            hookType: "debugger"
        }
    }
    var hookType = options.hookType;
    var code = "var debugIds = [];";
    var {debugPropertyGets, debugPropertySets, debugCalls} = breakpoint;
    if (debugPropertyGets) {
        debugPropertyGets.forEach(function(property){
            code += "debugIds.push(breakpoints.debugPropertyGet(" + property.obj + ", \"" + property.prop + "\", \"" + hookType + "\"));";
        })
    }
    if (debugPropertySets) {
        debugPropertySets.forEach(function(property){
            code += "debugIds.push(breakpoints.debugPropertySet(" + property.obj + ", \"" + property.prop + "\", \"" + hookType + "\"));";
        })
    }
    if (debugCalls) {
        debugCalls.forEach(function(property){
            code += "debugIds.push(breakpoints.debugCall(" + property.obj + ", \"" + property.prop + "\", \"" + hookType + "\"));";
        })
    }
    code += "debugIds;"
    console.log("eval code", code)
    chrome.devtools.inspectedWindow.eval(code, function(debugIds){
        console.log("done eval activate code", arguments)
        breakpoint.activated = true;
        breakpoint.debugIds = debugIds;
        breakpoint.hookType = hookType;
        app.update();
    });
}

function deactivateBreakpoint(breakpoint, cb) {
    var code = "";
    breakpoint.debugIds.forEach(function(debugId){
        code += "breakpoints.reset(" + debugId + ");"
    })
    console.log("eval deactivate", code)
    chrome.devtools.inspectedWindow.eval(code, function(){
        console.log("done eval deactivate code", arguments)
        breakpoint.debugIds = undefined
        breakpoint.activated = false;
        app.update();
        if (cb) {cb()}
    })   
}

function updateBreakpoint(breakpoint, traceOrDebugger){
    console.log("updateBreakpoint", traceOrDebugger)
    deactivateBreakpoint(breakpoint, function(){
        activateBreakpoint(breakpoint, {
            hookType: traceOrDebugger
        })
    });
}

var app = null;

export default class App extends React.Component {
    componentDidMount(){
        app = this;
    }
    render(){
        return <div className="col-parent">
            <div>JavaScript Breakpoint Collection</div>
            <div>
                <h2>Breakpoints</h2>
                <UnactivatedBreakpointList breakpoints={getUnactivatedBreakpoints()} />
            </div>
            <div>
                <h2>Activated Breakpoints</h2>
                <ActivatedBreakpointList breakpoints={getActivatedBreakpoints()} />
            </div>
        </div>

    }
    update(){
        console.log("update")
        this.setState({sth: Math.random()})
    }
}