chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
        chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject });
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);
    

    chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("onMessage", request);
    devToolsConnection.postMessage(request)
  });


    devToolsConnection.onDisconnect.addListener(function() {
         devToolsConnection.onMessage.removeListener(devToolsListener);
    });
})