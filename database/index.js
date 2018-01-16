var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var auth = require('../auth/login');
var error = require('../error/handle-error');
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

exports.deleteUser = function(req,res){
  db.collection(TABLE.collections.contacts).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      error.handleError(res, err.message, "Não foi possível deletar este registro");
    } else {
      res.status(200).json({success: `o ID ${req.param.id} foi deletado com sucesso`});
    }
  });
}

exports.getContactById = function(req,res){
  db.collection(TABLE.collections.contacts).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err || undefined || null) {
      error.handleError(res, err.message, "Não foi possível obter este registro");
    } else {
      res.status(200).json(doc);
    }
  });
}

exports.updateUser = function(req,res){
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(TABLE.collections.contacts).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      error.handleError(res, err.message, "Não foi possível atualizar este registro");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json({success: `O registro ${updateDoc._id} foi atualizado`});
    }
  });
}

module.exports = exports;