var s = document.createElement('script');
s.src = chrome.extension.getURL('build/javascript-breakpoint-collection.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener("RebroadcastExtensionMessage", function(evt) {
    try {
        chrome.runtime.sendMessage(evt)
    } catch (err) {
        // `Cannot read property 'name' of undefined` can be caused by background page refresh (e.g. alt+r)
        console.log("Sending info to DevTools tab failed:", err)
    }
}, false);