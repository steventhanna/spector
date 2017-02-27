$(document).ready(function() {

  chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "markquery");
    port.onMessage.addListener(function(msg) {
      $("body").unmark();
      $("body").mark(msg.query);
    });
  });

  // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //   console.log(sender.tab ?
  //     "from a content script:" + sender.tab.url :
  //     "from the extension");
  //
  //   $("body").mark(request.query);
  // })
});
