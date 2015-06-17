var express = require('express');
var dao = require('./dao');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
app.use(express.static(process.cwd() + '/public')).listen(process.env.PORT || 3000);
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


app.post('/songsIStole', dao.getSongsIStole, function(req, res){
});


app.post('/songsStolenFromMe', dao.getSongsStolenFromMe, function(req, res){
});


app.post('/connect' , dao.connect ,function(req, res){
});

console.log('listening on port '+3000);
