var fs = require("fs");
var code = fs.readFileSync("extension/build/javascript-breakpoint-collection.js")
code = "window.__BP_SHOW_CONSOLE_API_MESSAGE = true;\n" + code;
fs.writeFileSync("dist/javascript-breakpoint-collection.js", code)
