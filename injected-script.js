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
    }
}
