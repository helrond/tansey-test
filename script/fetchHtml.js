$(document).on("click", "#fetch", function(e) {
  e.preventDefault()
  $("#result").empty()
  $("#result").append("Checking...")
  var url = $("input#url").val()

  if(url.length) {
    $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'"+url+"'%20and%20xpath%3D%22%2F%2Fbody%2F*%22&format=json&diagnostics=true",
    function(data){
      results = JSON.stringify(data).replace(/"/g, ' ').replace(/'/g, ' ')
      $("#result").empty()
      searchTerms = ["archivist", "archivists", "Archivist", "Archivists"]
      var matches, matches = []
      for(var i in searchTerms) {
        console.log("Looking for " + searchTerms[i])
        var n = results.search(searchTerms[i])
        if(n > 0){
          matches = +matches+1
        }
        console.log(matches + " matches")
      }
      if(matches > 0){
        $("#result").append("Yes, this is about archives!")
      } else {
        if(data.query.diagnostics.url[0].error) {
          $("#result").append("Oops, I got an error: "+data.query.diagnostics.url[0].error)
        } else {
          $("#result").append("Yeah no, this isn't about archives. It doesn't mention archivists even once.")
        }
      }
    })
  } else {
    $("#result").empty()
    $("#result").append("It looks like you didn't enter anything!")
  }
});
