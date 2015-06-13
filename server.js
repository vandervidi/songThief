var express = require('express');
var dao = require('./dao');
var app = express();
app.use('/', express.static('./public')).listen(process.env.PORT || 3000);
app.use(function(req,res,next){
	//Setting headers for external requests
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	res.set("Content-Type", "application/json");
	next();
});

app.get('/songsIStole' , function(req, res){
	// set response status to 200 and return data as a json format
	res.status(200).json(dao.getSongsIStole);
});

app.get('/songsStolenFromMe' , function(req, res){
	// set response status to 200 and return data as a json format
	res.status(200).json(dao.songsStolenFromMe);
});

app.get('/connect' , function(req, res){
	// set response status to 200 and return data as a json format
	res.status(200).json(dao.connect);
});

