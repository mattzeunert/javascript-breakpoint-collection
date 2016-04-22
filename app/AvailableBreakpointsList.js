import React from "react"
import {activateBreakpoint} from "./app"

class AvailableBreakpointsListItem extends React.Component {
    render(){
        return <div onClick={()=>this.props.onClick()}
            className="unactivated-breakpoint-list-item">
            {this.props.breakpoint.title}
            <div className="plus">+</div>
        </div>
    }
}

export default class AvailableBreakpointsList extends React.Component {
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