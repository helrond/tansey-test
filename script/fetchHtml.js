// function is activated when the "Check it!" button is clicked
$(document).on("click", "#fetch", function(e) {
  // prevent the default action, which reloads the page
  e.preventDefault()
  // tell the user a check is in progress
  $("#result").empty()
  $("#result").append("Checking...")
  // grab the url from the input box
  var url = $("input#url").val()

  // returns all the values in a JSON array which match a specific key
  function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(getValues(obj[i], key));
      } else if (i == key) {
        objects.push(obj[i]);
      }
    }
    return objects;
  }

  // loop through a JSON array and return the index of all instances which contain a search term
  function getAllIndexes(arr) {
    var indexes = [], i;
    var match, matches = [];
    regex = /archivist/i
    for(i = 0; i < arr.length; i++)
      if (regex.exec(arr[i]))
        indexes.push(i);
    return indexes;
  }

  // the main function
  if(url.length) {
    // Uses the Yahoo Query Language to return the HTML of a URL as a JSON object
    $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'"+url+"'%20and%20xpath%3D%22%2F%2Fbody%2F*%22&format=json&diagnostics=true",
    function(data){
      // return all values associated with content keys in the object
      content = getValues(data, "content");
      // return indexes of all matches of a regular expression within the array
      matches = getAllIndexes(content);
      // calculate the percentage of matches per piece of content
      percentage = (matches.length/content.length*100).toFixed(0);
      $("#result").empty();
      // display the results to the user
      if(matches.length > 0){
        $("#result").append("Yes, this passes the Tansey test! <br/><small>There are "+matches.length+" mentions of archivists on this page, and our fancy calculator says this page is "+percentage+"% about archives!</small>").append('<div class="row">&nbsp;</div><div class="col-xs-12"><div class="progress"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+percentage+'" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">'+percentage+'% about archivists</span></div></div></div>');
        setTimeout(function() {
          $(".progress-bar").delay(4000).css("width", percentage+"%");
        }, 100);
      } else {
        // if there was an error, tell me about it
        if(data.query.diagnostics.url[0].error) {
          $("#result").append("Oops, I got an error: "+data.query.diagnostics.url[0].error)
        // if no hits were returned, tell the user the page isn't about archives
        } else {
          $("#result").append("Yeah no, this isn't about archives. It doesn't mention archivists even once.")
        }
      }
    })
    // handle case where no URL is entered
  } else {
    $("#result").empty();
    $("#result").append("It looks like you didn't enter anything!");
  }
});
