# JavaScript Breakpoint Collection

A collection of breakpoints, for example you can pause when the scroll position is updated or when cookie data is written.

Either use the UI or use it from the console:

    breakpoints.debugScroll()
    breakpoints.debugPropertySet(obj, "propertyName", "trace") // trace instead of pausing
    breakpoints.debugCookieWrites(function(){ /* whatever */ })

## Chrome Extension

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/javascript-breakpoint-col/kgpjjblahlmjlfljfpcneapmeblichbp)

TODO: screenshot

## Bookmarklet

TODO

## Development

Run `webpack --watch` to build the project. Run the tests with `karma start`.