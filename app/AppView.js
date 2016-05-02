import React from "react"
import {appState, registerAppView} from "./app"
import AvailableBreakpointsList from "./AvailableBreakpointsList"
import ActiveBreakpointsList from "./ActiveBreakpointsList"

export default class AppView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            availableBreakpointsListSearchString: ""
        }
    }
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
                        To debug property access and function calls on any object, use the code below in the console.
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
                            breakpoints.debugScroll(function(details){"{"}<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;console.log('JS changed scroll position', details)<br/>
                            {"}"});
                        </pre>
                        <br/>
                        <a href="https://github.com/mattzeunert/javascript-breakpoint-collection/blob/master/console-api.md" target="_blank">
                            Learn more
                        </a>
                    </div>
                    <p>
                        <a href="https://github.com/mattzeunert/javascript-breakpoint-collection/issues/new" target="_blank">
                            Report an issue or request a feature
                        </a>
                    </p>
                </div>
            </div>
            <div>
                <input
                    type="search"
                    placeholder="Search..."
                    className="available-breakpoints-search-input"
                    onChange={(e) => this.setState({
                        availableBreakpointsListSearchString: e.target.value
                    })} />
                <h2>Add Breakpoint</h2>
                <div className="col-content">
                    <AvailableBreakpointsList
                        search={this.state.availableBreakpointsListSearchString}
                        breakpoints={appState.predefinedBreakpoints} />
                </div>
            </div>
            <div>
                <h2>Active Breakpoints</h2>
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
