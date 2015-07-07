var mongoose = require('mongoose');

//configuring connection to mongoLab
mongoose.connect('mongodb://admin:1234@ds043942.mongolab.com:43942/songthief');
//import schema module
var userSchema = require('./userSchema').userSchema;
//configure the imported schema as a model and give it an alias
mongoose.model('UserM' , userSchema);
var UserM;
var conn = mongoose.connection;

//Print error message 
conn.on('error', function(err){
	console.log('connection error:' + err);
});

//This function returns a list of songs a user stole from his friends
exports.getSongsIStole = function(req,res){
	var user = req.body.username.toLowerCase();
	
	UserM.findOne({ 'username' : user }, 'mySteal', function (err, doc) {
		if (err) return handleError(err);
		res.json(doc.mySteal);
	});
};

//This function connects to the database and returns a list of songs stolen from a user
exports.getSongsStolenFromMe = function(req, res){
	// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
	var user = req.body.username.toLowerCase();

	UserM.findOne({ 'username' : user }, 'mySongs', function (err, doc) {
		if (err) return handleError(err);

		var songsStealed = [];
		for (var i=0; i<doc.mySongs.length; i++){
			//console.log(doc.mySongs[i])
			if (doc.mySongs[i].stolen){
				songsStealed.push(doc.mySongs[i]);
			}
		}
		res.json(songsStealed);
	});
};

//This function connects to the database and checks if the credentials the user supplied
//are valid.
exports.connect = function(req,res){
	console.log('connect()');

	UserM.findOne({ userId: req.body.userId}, function (err, doc){
		if (err) return res.json({success: 0});
		if (!!doc){
			//the user exists then modify friends list
			UserM.update(
				{ 
					userid: req.body.userId, 
					profilePic: req.body.profilePic
				},
				{friends:req.body.friendsList},
				function callback (err, numAffected) {
					console.log(numAffected + " Users were affected");
			  		// numAffected is the number of updated documents
			  		if (err) return res.json({success: 0});
			  		else{
			  			res.json({success: 1});
			  		}
				}
			);
	 		
	 	}else {
	 		//else , create new user
	 		//--------Inserting into database -------
			//Step 1: Create a new model
			console.log('creating new user');
			var newUser = new UserM({
				userId: req.body.userId,
				profilePic: req.body.profilePic, 
				needShowMessage: false,
				//robbers: [],
				location: {
					lat: req.body.location.lat,
					lng: req.body.location.lng
				},
				friends: req.body.friendsList
				// mySongs: [],
				// mySteal: [],
			});

			newUser.save(function(err, doc){
				if (err) return res.json({success: 0});
		  		else{
		  			console.log("saved- " + doc);
		  			res.json({success: 1});
		  		}
			});
	  	}
	});

};

//once a connection is initiated - do the following
conn.once('open' , function(){
	console.log('connected');
	UserM = this.model('UserM');
});

//When the node process is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

