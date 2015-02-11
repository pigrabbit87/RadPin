// Global accessor that the popup uses
var board_names = {};

function showPinterestAction(tabId) {
  chrome.tabs.get(tabId, function(tab){
    if(tab.url.indexOf('pinterest.com') > -1){
      chrome.pageAction.show(tabId);
    }
  });
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
  board_names = request.board_name_arr;
  console.log(board_names.length);
});

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