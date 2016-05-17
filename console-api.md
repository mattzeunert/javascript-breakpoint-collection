# Console API

## Adding breakpoints from the console

To add a pre-defined breakpoint just call its function on the `breakpoints` object:

    breakpoints.debugScroll()

If you want to debug a custom object you have to pass in the object and property you
want to debug.

    var obj = {test: "value"}
    breakpoints.debugPropertySet(obj, "test")
    obj.test = "hi" // Pauses execution

You can use the following three functions:

- **debugPropertyGet** to pause when a value is read, e.g. just running `obj.test`
- **debugPropertySet** to pause when a value is set, e.g. `obj.test = "hi"`
- **debugPropertyCall** to pause when a value is called, g.. `obj.sayHello()`

The pre-defined breakpoints are just combinations of these calls. For example:

    breakpoints.debugLocalStorageWrites()

Is equivalent to:

    breakpoints.debugPropertyCall(localStorage, "setItem")
    breakpoints.debugPropertyCall(localStorage, "clear")

## Tracepoints

If you don't pass any additional parameters into the functions above they will pause
execution when the breakpoint is hit.

However, you can also simply show a trace message without interrupting execution, by
passing in "trace" as a third argument:

    breakpoints.debugPropertySet(obj, "test", "trace")

![Trace message in console](https://cloud.githubusercontent.com/assets/1303660/14970397/6faeeafc-10c0-11e6-8fcd-8f24b78225ff.png)

Or, for pre-defined breakpoints, passing in "trace" as the first parameter:

    breakpoints.debugLocalStorageWrites("trace")

## Custom callbacks

Instead of "trace" you can also pass in a custom function that should be called when
the breakpoint is hit

    breakpoints.debugScroll(function(details){
        // do whatever here
        console.log("In debugScroll callback with details:", details)
    })

The details will vary depending on the breakpoint, but generally will have this information:

- **object** a reference to the object being debugged
- **propertyName** the name of the property being debugged
- **callArguments** when using debugPropertyCalls this will contain the arguments the function
is being called with
- **thisArgument** when using debugPropertyCalls this will be the execution context the function is called with.

## Resetting breakpoints

You can either use `breakpoints.resetLastBreakpoint()` to reset the most recently
created breakpoint, or use `breakpoints.resetAllBreakpoints()` to reset all breakpoints
added using JS Breakpoint Collection.

## Links

[Bookmarklet](http://www.mattzeunert.com/javascript-breakpoint-collection/bookmarklet.html)  
[Chrome Extension](https://chrome.google.com/webstore/detail/javascript-breakpoint-col/kgpjjblahlmjlfljfpcneapmeblichbp)
