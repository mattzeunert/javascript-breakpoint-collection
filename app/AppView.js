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
                <div className="left-column-header">
                    JavaScript Breakpoint Collection
                </div>
                <div className="col-content">
                    <p>
                        Click on a breakpoint on the right to add it.
                    </p>
                    <p>
                        To debug property access and function calls on arbitray objects use the code below in the console.
                    </p>
                    <div className="code-section">
                        <pre>
                            breakpoints.debugPropertySet(object, "propertyName");
                        </pre>
                        <pre>
                            breakpoints.debugPropertyGet(document, "cookie", "trace");
                        </pre>
                        <pre>
                            breakpoints.debugPropertyCall(localStorage, "setItem");
                        </pre>
                        <br/>
                        <pre>
                            breakpoints.debugScroll(function(){"{"}<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;console.log('JS changed scroll position', details)<br/>
                            {"}"});
                        </pre>
                    </div>
                    <p>
                        <a href="https://github.com/mattzeunert/javascript-breakpoint-collection/issues/new" target="_blank">
                            Report an issue or request a feature
                        </a>
                    </p>
                </div>
            </div>
            <div>
                <h2>Add Breakpoint</h2>
                <div className="col-content">
                    <AvailableBreakpointsList breakpoints={appState.predefinedBreakpoints} />
                </div>
            </div>
            <div>
                <h2>Activated Breakpoints</h2>
                <div className="col-content">
                    <ActiveBreakpointsList breakpoints={appState.registeredBreakpoints} />
                </div>
            </div>
        </div>
    }
    update(){
        this.setState({sth: Math.random()})
    }
}
