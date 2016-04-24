import React from "react"
import {deactivateBreakpoint, updateBreakpoint} from "./app"
import BreakpointTypeSelector from "./BreakpointTypeSelector"

class ActiveBreakpointsListItem extends React.Component {
    render(){
        return <div className="activated-breakpiont-list-item">
            {this.props.breakpoint.details.title}
            <button
                className="delete" 
                onClick={() => deactivateBreakpoint(this.props.breakpoint)}>
                &times;
            </button>
            <div style={{marginTop: 4}}>
                <BreakpointTypeSelector
                    value={this.props.breakpoint.details.type}
                    onChange={(breakpointType) => updateBreakpoint(this.props.breakpoint, breakpointType)} />
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