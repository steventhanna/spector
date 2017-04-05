/**
 * Delegate :: Handles interaction between user interface and content-scripts
 */

$(document).ready(function() {
  // When there is input in the search box, run the search function
  $("#searchBox").bind('input', function() {
    var currentVal = $(this).val();
    runSearch(currentVal);
  });

  $("#upButton").click(function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var port = chrome.tabs.connect(tabs[0].id, {
        name: "pager"
      });
      port.postMessage({
        val: "up"
      });
    });
  });

  $("#downButton").click(function() {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var port = chrome.tabs.connect(tabs[0].id, {
        name: "pager"
      });
      port.postMessage({
        val: "down"
      });
    });
  });

  /**
   * runSearch
   * Searchs through the text in the page
   * @param :: String val - the value from the search box
   */
  function runSearch(val) {
    // Query the content script
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var port = chrome.tabs.connect(tabs[0].id, {
        name: "markquery"
      });
      port.postMessage({
        query: val
      });
    });
  }
});
