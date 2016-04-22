import React from "react"

var log = function(){}

var registeredBreakpoints = [];

import predefinedBreakpoints from "../breakpoints/predefinedBreakpoints"

class AvailableBreakpointsListItem extends React.Component {
    render(){
        return <div onClick={()=>this.props.onClick()}
            className="unactivated-breakpoint-list-item">
            {this.props.breakpoint.title}
            <div className="plus">+</div>
        </div>
    }
}

class AvailableBreakpointsList extends React.Component {
    render(){
        return <div>
            {this.props.breakpoints.map(
                (bp) => <AvailableBreakpointsListItem
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
    var code = "window.breakpoints.__internal.createSpecificBreakpoint('" + breakpoint.title + "')"
    chrome.devtools.inspectedWindow.eval(code, function(){
        // console.log("done eval activate code", arguments)
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

function evalInInspectedWindow(code, callback){
    chrome.devtools.inspectedWindow.eval(code, callback);
}

function readBreakpointsFromPage(){
    evalInInspectedWindow("breakpoints.__internal.getRegisteredBreakpoints();", function(regBp){
        registeredBreakpoints = regBp;
        app.update();
    });
}

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
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
                    <pre>
                        breakpoints.debugScroll(function(){"{ /* ... */ }"});
                    </pre>
                </div>
            </div>
            <div>
                <h2>Breakpoints</h2>
                <AvailableBreakpointsList breakpoints={predefinedBreakpoints} />
            </div>
            <div>
                <h2>Activated Breakpoints</h2>
                <ActivatedBreakpointList breakpoints={registeredBreakpoints} />
            </div>
        </div>

    }
    update(){
        this.setState({sth: Math.random()})
    }
}