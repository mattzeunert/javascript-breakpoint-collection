
console.log("start")
var breakpoints = require("./dist/node.js")
var obj = {"hi": "ho"}
breakpoints.debugPropertyGet(obj, "hi", "trace")
obj.hi
console.log("end")
