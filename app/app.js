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
        return <div>
            {this.props.breakpoint.title}
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

function activateBreakpoint(breakpoint){
    var code = "";
    var {debugPropertyGets, debugPropertySets, debugCalls} = breakpoint;
    if (debugPropertyGets) {
        debugPropertyGets.forEach(function(property){
            code += "breakpoints.debugPropertyGet(" + property.obj + ", \"" + property.prop + "\");";
        })
    }
    if (debugPropertySets) {
        debugPropertySets.forEach(function(property){
            code += "breakpoints.debugPropertySet(" + property.obj + ", \"" + property.prop + "\");";
        })
    }
    if (debugCalls) {
        debugCalls.forEach(function(property){
            code += "breakpoints.debugCall(" + property.obj + ", \"" + property.prop + "\");";
        })
    }
    console.log("eval code", code)
    chrome.devtools.inspectedWindow.eval(code, function(){
        console.log("done eval code", arguments)
    });

    breakpoint.activated = true;
    app.update();
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