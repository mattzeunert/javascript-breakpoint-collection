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
        console.log("Breakpoints: Sending info to DevTools tab failed:", err)
        console.log("Breakpoints: This can occur after reloading the extension. Close and re-open the current tab to fix it.")
    }
}, false);