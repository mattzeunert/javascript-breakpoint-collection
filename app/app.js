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

class BreakpointListItem extends React.Component {
    render(){
        return <div onClick={()=>this.props.onClick()}>
            {this.props.breakpoint.title}
        </div>
    }
}

class BreakpointList extends React.Component {
    render(){
        return <div>
            {this.props.breakpoints.map(
                (bp) => <BreakpointListItem
                    onClick={() => activateBreakpoint(bp)}
                    breakpoint={bp} />
            )}
        </div>
    }
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
}

export default class App extends React.Component {
    render(){
        return <div>
            <BreakpointList breakpoints={breakpoints} />
        </div>
    }
}