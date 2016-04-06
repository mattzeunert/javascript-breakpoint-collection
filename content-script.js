console.log("content script loaded")

var s = document.createElement('script');
s.src = chrome.extension.getURL('eee.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener("RebroadcastExtensionMessage", function(evt) {
    console.log("RebroadcastExtensionMessage")
  chrome.runtime.sendMessage({action: "update"})
}, false);