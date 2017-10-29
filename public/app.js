//Grab the articles as a json
$.getJSON("/articles", function(data) {
  //For each article
  for (var i = 0; i < data.length; i++) {
    //Display apropos info on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");    
  }
});

//When someone clicks a <p> tag
$(document).on("click", "p", function() {
  //Empty notes from note section
  $("notes").empty();
  //Save id from the <p> tag
  var thisId = $(this).attr("data-id");

  //Make AJAx call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

  //Once done, add note info to page
  .done(function(data) {
    console.log(data);
    //Title of the article
    $("#notes").append("<h2>" + data.title + "</h2>");
    //Input to enter a new note title
    $("#notes").append("<input id='titleinput' name='title' >");
    //Textarea to add new note body
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    //button to submit new note, id of article saved to it
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'> Save Note</button>");

    //If there's a note in the article
    if (data.note) {
      //Place title of note in title input
      $("#titleinput").val(data.note.title);
      //Place body of note in body text area
      $("#bodyinput").val(data.note.body);
    }
  });
});

//When you click the save note buttone
$(document).on("click", "#savenote", function() {
  //Grab id associated with article from the submit button
  var thisId = $(this).attr("data-id");

  //Run a POST request to change note, using what's entered in inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      //Value taken from title input
      title: $("#titleinput").val(),
      //Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
  .done(function(data) {
    //Log response
    console.log(data);
    //Empty notes section
    $("#notes").empty();
  });

  //Also, remove values entered in input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});