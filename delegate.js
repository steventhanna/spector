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
    var elements = document.getElementsByTagName('*');
    for (var key in elements) {
      // skip loop if the property is from prototype
      if (!elements.hasOwnProperty(key)) continue;

      var obj = elements[key];
      for (var prop in obj) {
        // skip loop if the property is from prototype
        if (!obj.hasOwnProperty(prop)) continue;

        // your code
        console.log(prop + " = " + obj[prop]);
      }
    }
    console.log(val);
  }
});
