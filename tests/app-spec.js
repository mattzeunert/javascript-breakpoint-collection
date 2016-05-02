import AppView from "../app/AppView"
import TestUtils from "react-addons-test-utils"
import React from "react"
import ReactDOM from "react-dom"
import AvailableBreakpointsList from "../app/AvailableBreakpointsList"
import predefinedBreakpoints from "../breakpoints/predefinedBreakpoints"

describe("Breakpoints UI/App", function(){
    var component = TestUtils.renderIntoDocument(<AppView/>);
    var node = ReactDOM.findDOMNode(component);

    it("Shows a list of predefined breakpoints", function(){
        var availableBreakpointsListComponent =  TestUtils.findRenderedComponentWithType(
            component,
            AvailableBreakpointsList
        );
        var listNode = ReactDOM.findDOMNode(availableBreakpointsListComponent);
        expect(listNode.children.length).toBe(predefinedBreakpoints.length)
    })
})
