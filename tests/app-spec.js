import AppView from "../app/AppView"
import TestUtils from "react-addons-test-utils"
import React from "react"
import ReactDOM from "react-dom"
import AvailableBreakpointsList from "../app/AvailableBreakpointsList"
import predefinedBreakpoints from "../breakpoints/predefinedBreakpoints"

fdescribe("Breakpoints UI/App", function(){
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

    it("After adding a breakpoint it appears in the list of activated breakpoints", function(){
        var addTraceToCookieReadsButton = node.querySelector("[data-test-marker-available-bp-title='debugCookieReads']")
        TestUtils.Simulate.click(addTraceToCookieReadsButton);

        var activatedBreakpoint = node.querySelector("[data-test-marker-activated-bp-title='debugCookieReads']")
        expect(activatedBreakpoint).not.toBe(null)
    })
})
