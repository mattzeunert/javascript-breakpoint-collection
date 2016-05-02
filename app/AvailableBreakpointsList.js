import React from "react"
import {activateBreakpoint, setTypeOfMostRecentBreakpointToDebugger} from "./app"

class AvailableBreakpointsListItem extends React.Component {
    render(){
        var convertToDebuggerTypeButton = null;
        var title = this.props.breakpoint.title;
        var plusButton = <div className="plus">+</div>;
        if (this.props.recentlyActivated) {
            convertToDebuggerTypeButton = <div style={{
                float: "right",
                background: "red",
                color: "white",
                padding: 5,
                paddingBottom: 3,
                paddingTop: 3,
                borderRadius: 4,
                marginTop: -3
            }}>
                Click again to change trace to debugger
            </div>
            plusButton = null;
            title = String.fromCharCode(160); //nbsp
        }

        return <div
                onClick={() => this.props.onClick()}
                onMouseLeave={() => this.props.onMouseLeave()}
                className="unactivated-breakpoint-list-item"
                data-test-marker-available-bp-title={title}>
            {title}
            {convertToDebuggerTypeButton}
            {plusButton}
        </div>
    }
}

export default class AvailableBreakpointsList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            recentlyActivatedBreakpoint: null
        }
    }
    render(){
        return <div>
            {this.getBreakpointsToShow().map(
                (bp) => {
                    var recentlyActivated = bp===this.state.recentlyActivatedBreakpoint;
                    return <AvailableBreakpointsListItem
                        key={bp.title}
                        recentlyActivated={recentlyActivated}
                        onMouseLeave={() => {
                            if (this.state.recentlyActivatedBreakpoint !== null) {
                                this.setState({recentlyActivatedBreakpoint: null})
                            }
                        }}
                        onClick={() => {
                            if (recentlyActivated) {
                                setTypeOfMostRecentBreakpointToDebugger();
                                this.setState({recentlyActivatedBreakpoint: null})
                            } else {
                                activateBreakpoint(bp);
                                this.setState({recentlyActivatedBreakpoint: bp})
                            }
                        }}
                        breakpoint={bp} />
                }
            )}
        </div>
    }
    getBreakpointsToShow(){
        return this.props.breakpoints.filter((breakpoint) => {
            return breakpoint.title.toLowerCase().indexOf(this.props.search.toLowerCase()) > -1;
        });
    }
}
