# JavaScript Breakpoint Collection

A collection of breakpoints, for example you can pause when the scroll position is updated or when cookie data is written.

Either use the UI or use it from the console:

    breakpoints.debugScroll()
    breakpoints.debugPropertySet(obj, "propertyName", "trace") // trace instead of pausing
    breakpoints.debugCookieWrites(function(){ /* whatever */ })

## Chrome Extension

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/javascript-breakpoint-col/kgpjjblahlmjlfljfpcneapmeblichbp)

![Breakpoint Extension Screenshot](https://cloud.githubusercontent.com/assets/1303660/14764345/635338a0-09ac-11e6-992b-312ecfdf53b3.png)

## Bookmarklet

TODO

## Development

Run `webpack --watch` to build the project. Run the tests with `karma start`.
