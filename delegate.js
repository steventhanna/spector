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

  chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "state");
    port.onMessage.addListener(function(msg) {
      if (msg.state == true) {
        $("#inputGroup").removeClass("has-error");
        $("#inputGroup").addClass("has-success");
        $("#upButton").removeClass("btn-danger");
        $("#upButton").addClass("btn-success");
        $("#downButton").removeClass("btn-danger");
        $("#downButton").addClass("btn-success");
      } else if (msg.state == false) {
        $("#inputGroup").removeClass("has-success");
        $("#inputGroup").addClass("has-error");
        $("#upButton").removeClass("btn-success");
        $("#upButton").addClass("btn-danger");
        $("#downButton").removeClass("btn-success");
        $("#downButton").addClass("btn-danger");
      } else {
        $("#inputGroup").removeClass("has-error");
        $("#inputGroup").removeClass("has-success");
        $("#upButton").removeClass("btn-success");
        $("#upButton").removeClass("btn-danger");
        $("#downButton").removeClass("btn-danger")
        $("#downButton").removeClass("btn-success")
      }
    });
  });

});
