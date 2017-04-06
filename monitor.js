/**
 * The main content-script, runs in the context of each individual web page
 * This allows each new webpage to have a different instance of search running,
 * seperate from the unified UI.
 */

$(document).ready(function() {

  var elems = [];
  var imageState = undefined;
  var textState = undefined;

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
            if (num != undefined && num > 0) {
              textState = true;
            } else if (msg.query != undefined && msg.query.length > 0) {
              textState = false;
            } else {
              textState = undefined;
            }
            sendState();
            port.postMessage({
              count: num
            });
          }
        };
        $("body").unmark();
        removeHighlight();
        elems = [];
        counter = 0;
        if (msg.query == undefined || msg.query.length == 0) {
          textState = undefined;
          imageState = undefined;
        }
        $("body").mark(msg.query, options);
        scanImages(msg.query);
        // Sort the elems
        elems.sort(dynamicSort("offsetTop"));
      });
    } else if (port.name == "pager") {
      port.onMessage.addListener(function(query) {
        if (elems != undefined && elems.length > 0) {
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
        }
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
   * @param :: query - the search query to look through the images for
   * @return callback - when complete
   */
  function scanImages(query) {
    var images = document.images;
    // For testing, highlight all the images on the page to see if it even works
    async.each(images, function(image, cb) {
      analyzeImage(image, query, function(err) {
        if (err) {
          console.error("There was an error analyzing the image.");
          console.error(err);
        } else {
          cb();
        }
      });
    }, function(err) {
      if (err) {
        console.error(err);
      }
    });
  }

  /**
   * Highlight the image on the page
   * @param imageObj :: The image to highlight
   */
  function highlightImage(imageObj) {
    $(imageObj).addClass('image-highlight');
    $(imageObj).css('border-radius', '50%');
    $(imageObj).css('border', '5px solid yellow');
  }


  /**
   * Removes all highlighting from affected images
   * Hopefully this works
   */
  function removeHighlight() {
    var images = document.images;
    for (var i = 0; i < images.length; i++) {
      if (images[i].classList.contains('image-highlight') == true) {
        $(images[i]).removeClass('image-highlight');
        $(images[i]).css('border-radius', '');
        $(images[i]).css('border', '');
      } else {
        console.log("Image does not have class");
      }
    }
  }

  function removeImageHighlight(image) {
    $(image).removeClass('image-highlight');
    $(image).css('border-radius', '');
    $(image).css('border', '');
  }

  // Hold the most recent images
  var imageMap = new Map();

  /**
   * Analyze an image using tesseract
   * @param :: imageObj - the image object from the DOM
   * @param :: query - the query to check if the message contains
   * @returns :: the text inside the image if any
   */
  function analyzeImage(imageObj, query, callback) {
    // Image Text should alrady be lowercase at this point
    var imgText = imageMap.get(imageObj.src);
    query = query.toLowerCase();
    if (imgText != undefined) {
      if (imgText.includes(query) && query.length > 0) {
        highlightImage(imageObj);
        imageState = true;
      } else if (query.length > 0) {
        removeImageHighlight(imageObj);
        imageState = false;
      } else {
        imageState = undefined;
      }
      sendState();
      callback(undefined);
    } else {
      Tesseract.recognize(imageObj.src)
        .progress(function(message) {
          console.log("Progress is: " + JSON.stringify(message));
        })
        .catch(function(err) {
          callback(err);
        })
        .then(function(result) {
          console.log("Result is: " + result.text);
          var text = result.text.toLowerCase();
          // Add the analyzed data to the map for recall later
          imageMap.set(imageObj.src, text);
          console.log(result.text);
          if (text != undefined && text.includes(query) && query.length > 0) {
            // Highlight the image
            highlightImage(imageObj);
            imageState = true;
          } else {
            removeImageHighlight(imageObj);
            imageState = false;
          }
          sendState();
          callback(undefined);
        });
    }
  }

  /**
   * Send the state of the search (if results were found or not) back to the UI
   */
  function sendState() {
    var port = chrome.runtime.connect({
      name: "state"
    });
    port.postMessage({
      state: (imageState || textState)
    });
  }
});
