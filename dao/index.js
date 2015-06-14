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


//This function connects to the database and returns a list of songs a user stole from his friends
exports.getSongsIStole = function(req,res){
	var user = req.body.username.toLowerCase();
	console.log('getSongsIStole -> '+user);
	
	// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
	UserM.findOne({ 'username' : user }, 'mySteal', function (err, doc) {
		if (err) return handleError(err);
		console.log(doc.mySteal);
		res.json(doc.mySteal);
	});
};

//This function connects to the database and returns a list of songs stolen from a user
exports.getSongsStolenFromMe = function(req, res){
	// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
	var user = req.body.username.toLowerCase();
	console.log('getSongsStolenFromMe -> '+user);

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
exports.connect = function(user , pass){
	console.log("entered connect");
	var query = UserM.find().and([{ username: user }, { password: pass }])
	.exec(function(err, docs){
			console.log("interating results");
			console.log(docs);
			for(i in docs){
				console.log(i);
			if(i==0)
					return {connection: 1};
			}
		});
	return {connection: 0};
};

//once a connection is initiated - do the following
conn.once('open' , function(){
	console.log('connected');
	UserM = this.model('UserM');
});

//When the node preocess is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});



// return UserM.find().where('username').equals(user)
	// .exec(function(err, docs){
	// 		for(i in docs){
	// 			return docs[i];
	// 		}
	// 	});