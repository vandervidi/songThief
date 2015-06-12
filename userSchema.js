var mongoose = require('mongoose');
var schema = mongoose.Schema;
var usersSchema = new schema({
	userName: {type: String, index: 1, unique: 1, required: true},
	password: {type: String, required: true},
	fullName: String,
	needShowMessage: boolean,
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
		timestamp: Number,
		userName: String	
	}],
}, {collection: 'users'});

exports.usersSchema = usersSchema;