var mongoose = require('mongoose');
//configuring connection to mongoLab
mongoose.connect('mongodb://admin:1234@ds043942.mongolab.com:43942/songthief');
//import schema module
var userSchema = require('./userSchema').userSchema;
//configure the imported schema as a model and give it an alias
mongoose.model('UserM' , userSchema);
var UserM;
var conn = mongoose.connection;
var jsonData;

//Print error message 
conn.on('error', function(err){
	console.log('connection error:' + err);
});


//This function connects to the database and returns a list of songs a user stole from his friends
exports.getSongsIStole = function(username){
	console.log('getSongsIStole/'+username);

	// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
	return UserM.findOne({ 'username' : username }, 'mySteal', function (err, user) {
	  if (err) return handleError(err);
	  return user.mySteal;
	});
}

//This function connects to the database and returns a list of songs stolen from a user
exports.songsStolenFromMe = function(username){
		var data = [];
		return data;
};

//This function connects to the database and checks if the credentials the user supplied
//are valid.
exports.connect = function(user , pass){
	
	console.log("entered connect");
	var query = UserM.find().and([{ username: user }, { password: pass }])
	.exec(function(err, docs){
			console.log("iterating results");
			if (docs.length == 1)		
				jsonData = 	{connection: 1};
			else
				jsonData = 	{connection: 0};
			
		});
	return jsonData
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
