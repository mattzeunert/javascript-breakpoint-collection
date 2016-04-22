import React from "react"
import {appState, registerAppView} from "./app"
import AvailableBreakpointsList from "./AvailableBreakpointsList"
import ActiveBreakpointsList from "./ActiveBreakpointsList"

export default class AppView extends React.Component {
    componentDidMount(){
        registerAppView(this);
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
                    <pre>
                        breakpoints.debugScroll(function(){"{ /* ... */ }"});
                    </pre>
                </div>
                <div>
                    <a href="https://github.com/mattzeunert/javascript-breakpoint-collection/issues/new" target="_blank">
                        Report an issue or request a feature
                    </a>
                </div>
            </div>
            <div>
                <h2>Breakpoints</h2>
                <AvailableBreakpointsList breakpoints={appState.predefinedBreakpoints} />
            </div>
            <div>
                <h2>Activated Breakpoints</h2>
                <ActiveBreakpointsList breakpoints={appState.registeredBreakpoints} />
            </div>
        </div>
    }
    update(){
        this.setState({sth: Math.random()})
    }
}

