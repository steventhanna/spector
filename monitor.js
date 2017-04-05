/**
 * The main content-script, runs in the context of each individual web page
 * This allows each new webpage to have a different instance of search running,
 * seperate from the unified UI.
 */

$(document).ready(function() {

  var elems = [];

  var counter = 0;

  function scrollToPosition() {
    var loc = elems[counter];
    var height = loc.offsetTop;
    var width = loc.offsetWidth;
    if (height == 0) {
      counter++;
      if (counter > elems.length - 1) {
        counter = 0;
      } else if (counter < 0) {
        counter = elems.length - 1;
      }
      scrollToPosition();
    }
    console.log("Height: " + height + " Width: " + width);
    window.scrollTo(width, height);
  }


  chrome.runtime.onConnect.addListener(function(port) {
    if (port.name == "markquery") {
      port.onMessage.addListener(function(msg) {
        var options = {
          "each": function(node) {
            elems.push(node);
          },
          "done": function(num) {
            console.log("Number of matches: " + num);
            port.postMessage({
              count: num
            });
          }
        };
        $("body").unmark();
        elems = [];
        counter = 0;
        $("body").mark(msg.query, options);
        scanImages(function(elem) {
          console.log(elem);
        });
        // Sort the elems
        elems.sort(dynamicSort("offsetTop"));
        // for (var i = 0; i < elems.length; i++) {
        //   console.log(elems[i].offsetTop);
        // }
        // console.log(elems);
      });
    } else if (port.name == "pager") {
      port.onMessage.addListener(function(query) {
        if (query.val == "down") {
          counter++;
          if (counter > elems.length - 1) {
            counter = 0;
          }
        } else if (query.val == "up") {
          counter--;
          if (counter < 0) {
            counter = elems.length - 1;
          }
        } else {
          console.log("Something went wrong.");
        }
        scrollToPosition();
      });
    }
  });

  /**
   * Sorts an array of objects by a specific element within each object
   * @param :: A property to sorty by
   */
  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  /**
   * Get the image URLS from the page
   */
  function scanImages(callback) {
    var images = document.images;
    // For testing, highlight all the images on the page to see if it even works
    for (var i = 0; i < images.length; i++) {
      var temp = images[i].innerHTML;
      // console.log("Inner HTML: " + images[i].innerHTML);
      // images[i].innerHTML = '<mark data-markjs="true">' + temp + '</mark>';
      // Try using jQuery
      $(images[i]).addClass('image-highlight');
      $(images[i]).css('border-radius', '50%');
      $(images[i]).css('border', '5px solid yellow');
    }
    callback(document.images);
  }


  /**
   * Removes all highlighting from affected images
   */
  function removeHighlgiht() {
    var images = document.images;
    for (var i = 0; i < images.length; i++) {
      if ($(images[i]).hasClass() == true) {
        $(this).removeClass('image-highlight');
        $(images[i]).css('border-radius', '');
        $(images[i]).css('border', '');
      }
    }
  }
});
