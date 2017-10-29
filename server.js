var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Scraping Tool Axios
var axios = require("axios");
var cheerio = require("cheerio");

//Require models
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();

//Configure middleware

//Use morgan logger to log request
app.use(logger("dev"));

//Use body-parser to handle form submissions
app.use(bodyParser.urlencoded({extended: false}));

//Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set mongoose to leverage built in Javascript ES6 Promises
//Connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/3000", {
  useMongoClient: true
});

//Routes

// A GET route for scraping the nytimes website
app.get("/scrape", function(req, res){
  //First, grab html body with a request
  axios.get("http://www.nytimes.com/").then(function(response){
    //Then, load it into cheerio and save it to a $ for a shorthand selector
    var $ = cheerio.load(response.data);

    //Grab every h2 within the article tag, and do the following:
    $("h2.story-heading").each(function(i, element) {
      //Save an empty result object
      var result = {};

      //Add the text and href of every link then save them as properties of the reslt object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      //Create a new article using the 'result' object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          //If able to scrape and save an Article, send message to client
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          //If an error occurred, send it to client
          res.json(err);
        });


    })
  })
});

//Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  //Grabs every document in the Articles collection
  db.Article
  .find({})
  .then(function(dbArticle) {
    //If able to find Articles, send them back to the client
    res.json(dbArticle);     
  })
  .catch(function(err) {
    //If error occurred, send to the client
    res.json(err);
  });
});

//Route for grabbing a specific Article by id, populate it with its note
app.get("articles/:id", function(req, res) {
  //Using id passed in the id parameter, prepare query to find match in db
  db.Article
    .findOne({ _id: req.params.id })
    //populate all notes associated with specific Article
    .populate("note")
    .then(function(dbArticle) {
      //If able to find Article with given id, send back to client
      res.json(dbArticle);
    })
    .catch(function(err) {
      //If error occurred, send to client
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  //Create new note and pass req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      //If Note created successfully, find one article with '_id' equal to 'req.params.id'
      //Update Article to be associated with new Note
      //{ new:true} tells query to return Updated User instead of original
      //mongoose query returns promise, chain another '.then' which receives result of the query
      return db.Article.findOneandUpdate({ _id: req.params.id }, {note: dbNote._id }, { new: true});
    })
    .then(function(dbArticle) {
      //If able to successfully update Article, send back to client
      res.json(dbArticle);
    })
    .catch(function(err) {
      //If error occurred, send to client
      res.json(err);
    });
});

//Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
}); 
