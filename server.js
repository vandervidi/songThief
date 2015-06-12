var express = require('express');
var dao = require('./dao');
var app = express();

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://ofir:1234@ds043991.mongolab.com:43991/db_ringapp');

// var conn = mongoose.connection;

// conn.on('error', function (err) {
// 	console.log('connection error '+err);
// });
// conn.once('open', function () {
// 	console.log('connected.');

// 	mongoose.disconnect();
// });


app.use('/', express.static('./public')).listen(8080);