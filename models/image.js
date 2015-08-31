var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
	name: String,
	ID: String,
});

module.exports = mongoose.model('Images', ImageSchema);