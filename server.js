var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var jwt = require("jsonwebtoken");

var initdb = require('./database/connect')
var error = require('./error/handle-error');
// var login = require('./auth/login');
// var auth = require('./auth/auth.provider')
var TABLE = require('./configs/db-collections');

var database = require('./database')
var auth = require('./auth/auth.provider')

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

database.connect(function() {

  app.post('/api/login', database.login);

  app.get('/api/contacts', database.getContacts);

  app.post('/api/contacts', auth.handleAuthorization, database.registerUser);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

app.get("/api/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      error.handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/contacts/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      error.handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      error.handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});


