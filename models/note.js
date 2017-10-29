'use strict';
var mongoose = require("mongoose");

//Save reference to Schema constructor
var Schema = mongoose.Schema;

//Using Schema constructor, create new NoteSchema object
var NoteSchema = new Schema({
	note: {

		//'title' is type String
		title: String,
		//'body' is type String
		body: String
	}
});

//Creates model from above schema using mongoose model method
var Note = mongoose.model("Note", NoteSchema);

//Exports Note model
module.exports = Note;