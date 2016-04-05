import React from "react"

var breakpoints = [
    {
        title: "debugCookieReads",
        debugPropertyGetters: ["document.cookie"]
    },
    {
        title: "debugCookieWrites",
        debugPropertySetters: ["document.cookie"]
    },
    {
        title: "debuAlertCalls",
        debugCalls: ["window.alert"]
    },
    {
        title: "debugConsoleErrorCalls",
        debugCalls: ["window.console.error"]
    },
    {
        title: "debugConsoleLogCalls",
        debugCalls: ["window.console.log"]
    }
]

class BreakpointListItem extends React.Component {
    render(){
        return <div>
            {this.props.breakpoint.title}
        </div>
    }
}

class BreakpointList extends React.Component {
    render(){
        return <div>
            {this.props.breakpoints.map(
                (bp) => <BreakpointListItem breakpoint={bp} />
            )}
        </div>
    }
}

export default class App extends React.Component {
    render(){
        return <div>
            <BreakpointList breakpoints={breakpoints} />
        </div>
    }
}