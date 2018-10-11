var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var routeUsers = require('../api/routes/user');
var routePicture = require('../api/routes/picture');

var app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, ,PATCH, DELETE, OPTIONS');
  next();
});

app.use('/users', routeUsers);
app.use('/picture', routePicture);

module.exports = app;