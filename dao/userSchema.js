var mongoose = require('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({
	userId: {type: String, index: 1, unique: 1, required: true},
	profilePic: String, 
	robbers: [{
		type: String, unique: 1
	}],
	location: {
		lat: Number,
		lng: Number
	},
	friends: [{
		type: String, unique: 1
	}],
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
		userId: String	
	}],
	robbersGiveBackSong: [{
		type: String, unique: 1
	}],
}, {collection: 'users'});

exports.userSchema = userSchema;