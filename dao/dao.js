var mongoose = require('mongoose');
//configuring connection to mongoLab
mongoose.connect('mongodb://12345:12345@ds043062.mongolab.com:43062/db_ringapp');
//import schema module
var usersSchema = require('./usersSchema').usersSchema;
//configure the imported schema as a model and give it an alias
mongoose.model('UsersM' , usersSchema);



var conn = mongoose.connection;
//Print error message 
conn.on('error', function(err){
	console.log('connection error:' + err);
});

//once a connection is initiated - do the following
conn.once('open' , function(){
	console.log('connected');
	var User = this.model('UsersM');

	var query = User.find();
	query.where('status').in('D');

	query.exec(function(err, docs){
		for(i in docs){
				console.log(JSON.stringify(docs[i]));
		}
	});

	//--------Inserting into database -------
	//Step 1: Create a new model
	var newUser = new User({
		name : "Nimrod",
		age: 20,
		status: "D",
		groups: ["sport", "TV", "books"]
	});

	newUser.save(function(err, doc){
			console.log("saved- " + doc);	
	});
});

//When the node preocess is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});





