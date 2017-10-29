'use strict';
var mongoose = require("mongoose");

//Save reference to Schema constructor
var Schema = mongoose.Schema;

//Using Schema constructor, create new UserSchema object
var ArticleSchema = new Schema({
  //'title' type String & required
  title: {
    type: String,
    required: true
  },

  //'link' typreString & required
  link: {
    type: String,
    required: true
  },
  //Saving not default
  saved: {
    type: Boolean,
    default: false
  },

  //'note' is object that stores a Note id
  //ref property links ObjectId to Note model
  //Allows us to populate article with associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

//Creates model from above schema using mongoose model method
var Article = mongoose.model("Article", ArticleSchema);

//Exports Article model
module.exports = Article
