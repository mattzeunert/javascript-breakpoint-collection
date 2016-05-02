# JavaScript Breakpoint Collection [![Build status](https://api.travis-ci.org/mattzeunert/javascript-breakpoint-collection.svg?branch=master)](https://travis-ci.org/mattzeunert/javascript-breakpoint-collection)

Find out what part of your code is causing a behavior in the browsers. For example you can pause when the window scroll position is updated or when cookie data is written.

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

## Bookmarklet

<a href="http://www.mattzeunert.com/javascript-breakpoint-collection/bookmarklet.html">Get the bookmarklet</a>

## Development

Install the dependencies:

    npm install webpack -g
    npm install

The build the project:

    webpack --watch

And run the tests:

    npm run test

### Loading the extension in Chrome

1. Go to [chrome://extensions/](chrome://extensions/)
2. Enter Developer Mode
3. Load Unpacked Extension
4. Select "extension" directory in this repo

### Generating the bookmarklet

Run `node generate-bookmarklet.js`.

### Update website

`git subtree push  --prefix gh-pages origin gh-pages`
