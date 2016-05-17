var UglifyJS = require("uglify-js");

var result = UglifyJS.minify("./extension/build/javascript-breakpoint-collection.js", {
    compress: false
});
console.log("javascript:window.__BP_SHOW_CONSOLE_API_MESSAGE = true;eval(decodeURIComponent('" + encodeURIComponent(result.code).replace(/'/g, "\\'") + "'))");
