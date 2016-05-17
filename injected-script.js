import consoleInterface , {pushRegisteredBreakpointsToExtension} from "./breakpoints/consoleInterface"

module.exports = consoleInterface;
var isInBrowser = typeof window !== "undefined";
if (isInBrowser) {
    if (window.breakpoints !== undefined) {
        if (!window.breakpoints.__internal || !window.breakpoints.__internal.isBreakpointCollectionExtension) {
            console.log("Breakpoints extension can't load, global `breakpoints` variable is already defined")
        }
    } else {
        window.breakpoints = consoleInterface;

        pushRegisteredBreakpointsToExtension();

        if (window.__BP_SHOW_CONSOLE_API_MESSAGE){
            delete window.__BP_SHOW_CONSOLE_API_MESSAGE;
            console.log("Breakpoints Collection API docs: https://github.com/mattzeunert/javascript-breakpoint-collection/blob/master/console-api.md")
        }
    }
}
