var express = require('express');
var dao = require('./dao');
var users = require('./users');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
app.use(express.static(process.cwd() + '/public')).listen(process.env.PORT || 8020);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function(req,res,next){
	//Setting headers for external requests
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	next();
});

app.post('/connect' , users.connect ,function(req, res){
});

app.post('/songsIStole', users.getSongsIStole, function(req, res){
});

app.post('/songsStolenFromMe', users.getSongsStolenFromMe, function(req, res){
});

app.post('/getFriendsLocations', users.getFriendsLocations, function(req, res){
});

app.post('/getRobbers', users.getRobbers, function(req, res){
});

app.post('/rob', users.rob, function(req, res){
});

console.log('listening on port '+8020);
