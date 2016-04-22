chrome.devtools.panels.create("Breakpoints",
    null,
    "panel.html",
    function(panel) {

      // code invoked on panel creation
    }
);

chrome.devtools.network.onNavigated.addListener(installBreakpointsObject)

installBreakpointsObject();

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