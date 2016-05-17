# JavaScript Breakpoint Collection [![Build status](https://api.travis-ci.org/mattzeunert/javascript-breakpoint-collection.svg?branch=master)](https://travis-ci.org/mattzeunert/javascript-breakpoint-collection)

Find out what part of your code is causing a behavior in the browser. For example, you can pause when the window scroll position is updated or when cookie data is written.

[Live Demo](http://www.mattzeunert.com/javascript-breakpoint-collection/live-demo.html)

Either use the UI or add breakpoints from the console:

    breakpoints.debugScroll()
    breakpoints.debugPropertySet(obj, "propertyName", "trace") // trace instead of pausing
    breakpoints.debugCookieWrites(function(){ /* whatever */ })
    breakpoints.resetLastBreakpoint()

Learn more about the [Console API](https://github.com/mattzeunert/javascript-breakpoint-collection/blob/master/console-api.md).

## Chrome Extension

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/javascript-breakpoint-col/kgpjjblahlmjlfljfpcneapmeblichbp)

![Breakpoint Extension Screenshot](https://cloud.githubusercontent.com/assets/1303660/14769837/c9bf8438-0a59-11e6-8a16-5cff6886adbc.png)

Example trace message:

![Breakpoint Extension Trace Message Example](https://cloud.githubusercontent.com/assets/1303660/15340896/ba2182ba-1c83-11e6-88ab-73cc59daf956.png)

## Bookmarklet

<a href="http://www.mattzeunert.com/javascript-breakpoint-collection/bookmarklet.html">Get the bookmarklet</a>

## NPM

Download the module from NPM:

    npm install javascript-breakpoint-collection

Then load the module:

    var breakpoints = require("javascript-breakpoint-collection")

## Development

See [Contributing.md](https://github.com/mattzeunert/javascript-breakpoint-collection/blob/master/dev/CONTRIBUTING.md).
