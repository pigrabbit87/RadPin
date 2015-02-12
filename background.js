// Global accessor that the popup uses
var board_names = {};

function showPinterestAction(tabId) {
  chrome.tabs.get(tabId, function(tab){
    if(tab.url.indexOf('pinterest.com') > -1){
      chrome.pageAction.show(tabId);
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  var board_name = "";
  alert('the message wuuuuut from the content script: ' + request.key);
  chrome.storage.sync.get(null, function (Items) {
    if (request.key == 'E'){
      sendResponse({
        response: Items.boardE
      });
    }
    else if (request.key == 'D'){
      sendResponse({
        response: Items.boardE
      });
    }
    else {
      sendResponse({
        response: Items.boardE
      });
    }
  });
  return true;
});

function sendDetails(sendData){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {
      greeting: sendData
    }, function(response){
      alert("The respones from the content script: " + response.response);
    });
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete") {
	showPinterestAction(tabId);
  }
});

chrome.tabs.onActivated.addListener(function(tabId, info) {
  selectedId = tabId;
  showPinterestAction(tabId);
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  showPinterestAction(tabs[0].id);
});