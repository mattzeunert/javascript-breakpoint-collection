chrome.devtools.panels.create("Breakpoints",
    null,
    "panel.html",
    function(panel) {

    }
);

window.addEventListener("RebroadcastExtensionMessage", function(evt) {
  chrome.runtime.sendMessage(evt.detail);
}, false);
