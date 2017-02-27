$(document).ready(function() {

  chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "markquery");
    port.onMessage.addListener(function(msg) {
      $("body").unmark();
      $("body").mark(msg.query);
    });
  });
});
