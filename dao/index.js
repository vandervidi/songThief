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
exports.getSongsIStole = function(username){
	console.log('getSongsIStole/'+username);

	// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
	return UserM.findOne({ 'username' : username }, 'mySteal', function (err, user) {
	  if (err) return handleError(err);
	  return user.mySteal;
	});
<<<<<<< HEAD
	
=======
	//console.log(data);
>>>>>>> 4cd29caa35abe5024112ae1182f9f7644dc86f96
};

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
<<<<<<< HEAD
	UserM = this.model('UsersM');
=======
	UserM = this.model('UserM');

	// var query = User.find();
	// query.where('').in('D');

	// query.exec(function(err, docs){
	// 	for(i in docs){
	// 			console.log(JSON.stringify(docs[i]));
	// 	}
	// });


	//--------Inserting into database -------
	//Step 1: Create a new model
// 	var newUser = new User({
// 		name : "Nimrod",
// 		age: 20,
// 		status: "D",
// 		groups: ["sport", "TV", "books"]
// 	});

// 	newUser.save(function(err, doc){
// 			console.log("saved- " + doc);	
// 	});
>>>>>>> 4cd29caa35abe5024112ae1182f9f7644dc86f96
});

//When the node preocess is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});



// var query = UserM.find();
	// query.where('').in('D');

	// query.exec(function(err, docs){
	// 	for(i in docs){
	// 			console.log(JSON.stringify(docs[i]));
	// 	}
	// });

	// UserM.findOne()
	// .where('userName')
	// //.equals(username)
	// //.select('name occupation')
	// .exec(function(err, docs){
	// 	for(i in docs){
	// 			console.log(JSON.stringify(docs[i]));
	// 	}

	// });



