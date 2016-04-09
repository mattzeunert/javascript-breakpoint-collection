chrome.devtools.panels.create("Breakpoints",
    null,
    "panel.html",
    function(panel) {

      // code invoked on panel creation
    }
);

chrome.devtools.network.onNavigated.addListener(installBreakpointsObject)

installBreakpointsObject();

/*

run this code in the console for testing

window.a = {b: 5}
var id = breakpoints._debugObj(a, "b", {
    propertyGetBefore: function(){
        console.log("getting b")
    },
    propertySetAfter: function(){
        console.log("just set the value of a.b")
    },
    propertyCallBefore: function(){
        console.log("about to call a.b")
    },
    propertyCallAfter: function(){
        console.log("just called a.b")
    }
})

var id2 = breakpoints._debugObj(a, "b", {
    propertyGetBefore: function(){
        console.log("getting b (second handler)")
    }
})

window.a.b;
window.a.b = function(){
    console.log("inside the a.b function")
}
window.a.b();

breakpoints.reset(id)
breakpoints.reset(id2);
console.log("should only log one message between here...")
window.a.b();
console.log("...and here")

*/

window.addEventListener("RebroadcastExtensionMessage", function(evt) {
  //chrome.runtime.sendMessage(evt.detail);
  console.log("a thing happened")
  alert("thing")
}, false);

function installBreakpointsObject(){


    chrome.devtools.inspectedWindow.eval(`   `, function(){
        console.log("did eval", arguments)
    })
}