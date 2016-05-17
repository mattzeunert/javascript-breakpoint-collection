var UglifyJS = require("uglify-js");

var result = UglifyJS.minify("./extension/build/javascript-breakpoint-collection.js", {
    compress: false
});
var bookmarkletContent = "javascript:window.__BP_SHOW_CONSOLE_API_MESSAGE = true;eval(decodeURIComponent('" + encodeURIComponent(result.code).replace(/'/g, "\\'") + "'))";

var fs = require("fs");
var htmlContent = fs.readFileSync("./gh-pages/bookmarklet.html").toString()
htmlContent = htmlContent.replace(
    /data\-bookmarklet\-href([\s\S]*)data\-bookmarklet\-href\-end/i,
    "data-bookmarklet-href href=\"" + bookmarkletContent +  "\" data-bookmarklet-href-end"
);
fs.writeFileSync("./gh-pages/bookmarklet.html", htmlContent)
