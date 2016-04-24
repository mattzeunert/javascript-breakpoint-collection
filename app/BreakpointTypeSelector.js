import React from "react"

function getStyle(isSelected){
    var style = {};
    if (isSelected) {
        style.color = "white";
        style.backgroundColor = "#698CFE";
        style.border =  "1px solid #698CFE";
    } else {
        style.color = "black";
        style.backgroundColor = "white";
    }

    return style;
}

export default class BreakpointTypeSelector extends React.Component {
    render(){
        var options = ["trace", "debugger"];
        if (this.props.value === "custom") {
            options.push("custom")
        }

        return <div>
            {options.map((option, i) => {
                var isSelected = this.props.value === option;
                return <div
                    key={i}
                    className="breakpoint-type-selector__option"
                    style={getStyle(isSelected)}
                    onClick={() => this.props.onChange(option)}>
                    {option}
                </div>
            })}
        </div>
    }
}