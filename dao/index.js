var mongoose = require('mongoose');
// var conn;

	//configuring connection to mongoLab
mongoose.connect('mongodb://admin:1234@ds043942.mongolab.com:43942/songthief');
//import schema module
var userSchema = require('./userSchema').userSchema;
//configure the imported schema as a model and give it an alias
mongoose.model('UserM' , userSchema);
var UserM;
var conn = mongoose.connection;

//Mongoose error message output
conn.on('error', function(err){
	console.log('connection error:' + err);
});

// Once a connection is initiated - do the following
conn.once('open' , function(){
	console.log('connected');
	UserM = this.model('UserM');

});

//Exporting the USER schema model object
exports.conn = conn.model('UserM');

// When the node process is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

