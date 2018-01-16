var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var auth = require('../auth/login');
var user = require('../user/register')
var TABLE = require('../configs/db-collections');
var DATABASE_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
var db;

var exports = {}

exports.connect = function(callback) {
  MongoClient.connect(DATABASE_URI, function(err, database) {
    if( err ) throw err;
    db = database;
    callback();
  });
}

exports.getUserByEmail = function(email, callback){
  db.collection(TABLE.collections.contacts).find({"email":email}).toArray(function(err, docs) {
    callback(docs);
  });
};

exports.login = function(req,res){
  db.collection(TABLE.collections.contacts).find({"email":req.body.email}).toArray(function(err, docs) {
    auth.loginHandler(req,res,docs);
  });
}

exports.getContacts = function(req,res){
  db.collection(TABLE.collections.contacts).find({}).toArray(function(err, docs) {
    res.status(200).json(docs);
  });
}

exports.registerUser = function(req,res){

  exports.getUserByEmail(req.body.email, function(docs){

    if(docs.length == 0){
      db.collection(TABLE.collections.contacts).insertOne(req.body, function(err, doc) {
        res.status(201).json(doc.ops[0]);
      });
    }else{
      res.status(401).json({error: "Email já cadastrado"})
    }

  });

}

module.exports = exports;