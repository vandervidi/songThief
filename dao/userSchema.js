var mongoose = require('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({
	username: {type: String, index: 1, unique: 1, required: true},
	password: {type: String, required: true},
	fullName: String,
	needShowMessage: Boolean,
	mySongs: [{
		url: {type: String, unique: 1, required: true},
		songName: String,
		artist: String,
		stolen: Boolean,
		stealTimestamp: Number
	}],
	mySteal: [{
		url: {type: String, unique: 1, required: true},
		songName: String,
		artist: String,
		stealTimestamp: Number,
		username: String	
	}],
}, {collection: 'users'});

exports.userSchema = userSchema;