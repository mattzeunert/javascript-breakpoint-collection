import React from "react"
import {deactivateBreakpoint, updateBreakpointType} from "./app"
import BreakpointTypeSelector from "./BreakpointTypeSelector"

class ActiveBreakpointsListItem extends React.Component {
    render(){
        var title = this.props.breakpoint.details.title;
        return <div
            className="activated-breakpiont-list-item"
            data-test-marker-activated-bp-title={title}>
            {title}
            <button
                className="delete"
                data-test-marker-delete-bp
                onClick={() => deactivateBreakpoint(this.props.breakpoint)}>
                &times;
            </button>
            <div style={{marginTop: 4}}>
                <BreakpointTypeSelector
                    value={this.props.breakpoint.details.type}
                    onChange={(breakpointType) => updateBreakpointType(this.props.breakpoint, breakpointType)} />
            </div>
        </div>
    }
}

export default class ActiveBreakpointsList extends React.Component {
    render(){
        if (this.props.breakpoints.length === 0) {
            return <div style={{marginTop: 10}}>
                Click on a breakpoint on the left to activate it.
            </div>
        }
        return <div>
            {this.props.breakpoints.map((bp, i) =>
                <ActiveBreakpointsListItem key={i} breakpoint={bp} />
            )}
        </div>
    }
}
