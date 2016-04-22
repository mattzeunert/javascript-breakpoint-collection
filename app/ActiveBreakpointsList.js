import React from "react"
import {deactivateBreakpoint, updateBreakpoint} from "./app"

class ActiveBreakpointsListItem extends React.Component {
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

export default class ActiveBreakpointsList extends React.Component {
    render(){
        if (this.props.breakpoints.length === 0) {
            return <div>
                Click on a breakpoint on the left to activate it.
            </div>
        }
        return <div>
            {this.props.breakpoints.map(bp => 
                <ActiveBreakpointsListItem key={bp.title} breakpoint={bp} />
            )}
        </div>
    }
}