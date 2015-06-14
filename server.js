var express = require('express');
var dao = require('./dao');
var bodyParser = require('body-parser');
var app = express();
app.use('/', express.static('./public')).listen(process.env.PORT || 3000);
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

app.get('/songsIStole' , function(req, res){
	// set response status to 200 and return data as a json format
	res.status(200).json(dao.getSongsIStole('yeal_raz'));
});

app.get('/songsStolenFromMe' , function(req, res){
	// set response status to 200 and return data as a json format
	res.status(200).json(dao.songsStolenFromMe());
});

app.post('/connect' , function(req, res){
	// set response status to 200 and return data as a json format
	res.status(200).json(dao.connect(req.body.username, req.body.password));
});

