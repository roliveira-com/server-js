var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var jwt = require("jsonwebtoken");

var error = require('./error/handle-error');
var auth = require('./auth/auth.provider');
var TABLE = require('./configs/db-collections');


var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));


var db;
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017" , function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = database;
  console.log("Database connection ready");
});

function handleDupes(data, res, email){
  db.collection(TABLE.collections.contacts).find({"email": email }).toArray(function(err, docs) {
    if (err) {
      return error.handleError(res, err.message, "Não foi possível acessar os dados");
    }  else if (docs.length >= 1) {
      return error.handleError(res, "Email Já Cadastrado", "Email já Cadastrado!");
    } else {

      db.collection(TABLE.collections.contacts).insertOne(data, function(err, doc) {
        if (err) {
          return error.handleError(res, err.message, "Failed to create new contact.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });

    }
  });
}

app.post("/api/login", auth.handleLogin);

app.get("/api/contacts", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      error.handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/contacts", auth.handleAuthorization, function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.email) {
    return error.handleError(res, "Invalid user input", "É necessário informar o email", 400);
  }

  if (req.body.email) {
    handleDupes(newContact, res, req.body.email);
  }
});

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

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

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

