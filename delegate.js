$(document).ready(function() {

  // When there is input in the search box, run the search function
  $("#searchBox").bind('input', function() {
    var currentVal = $(this).val();
    runSearch(currentVal);
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
      console.log(typeof tabs);
      console.log(tabs[0].id);
      var port = chrome.tabs.connect(tabs[0].id, {
        name: "markquery"
      });
      port.postMessage({
        query: val
      });
      port.onMessage.addListener(function(msg) {});
    });
    // chrome.tabs.query({
    //   active: true,
    //   currentWindow: true
    // }, function(tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {
    //     query: val
    //   }, function(response) {
    //
    //   });
    // });
    // var elements = document.getElementsByTagName('*');
    // for (var key in elements) {
    //   // skip loop if the property is from prototype
    //   if (!elements.hasOwnProperty(key)) continue;
    //
    //   var obj = elements[key];
    //   for (var prop in obj) {
    //     // skip loop if the property is from prototype
    //     if (!obj.hasOwnProperty(prop)) continue;
    //
    //     // your code
    //     console.log(prop + " = " + obj[prop]);
    //   }
    // }
    // console.log(val);
  }
});
