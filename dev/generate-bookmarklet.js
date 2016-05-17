var UglifyJS = require("uglify-js");

var result = UglifyJS.minify("./extension/build/javascript-breakpoint-collection.js", {
    compress: false
});
console.log("javascript:eval(decodeURIComponent('" + encodeURIComponent(result.code).replace(/'/g, "\\'") + "'))");