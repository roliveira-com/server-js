var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var auth = require('../auth');
var status = require('../status');
var configs = require('../configs');


var db;
var exports = {}

exports.connect = function(callback) {
  MongoClient.connect( configs.database.uri, function(err, database) {
    if( err ) throw err;
    db = database;
    callback();
  });
}

exports.getUserByEmail = function(email, callback){
  db.collection(configs.collections.contacts).find({"email":email}).toArray(function(err, docs) {
    callback(docs);
  });
};

exports.login = function(req,res){
  db.collection(configs.collections.contacts).find({"email":req.body.email}).toArray(function(err, docs) {
    if (err){
      return error.handleError(res, err.message, configs.messages.databaseLogin);
    }
    auth.loginRegister(req, res, auth.loginHandler(req,res,docs), db);
  });
}

exports.provideAuthorization = function (req, res, next) {
  db.collection(configs.collections.token).find({ token : auth.extractToken(req) }).toArray(function (err, docs) {
    if (err) throw err
    auth.handleAuthorization(req, res, next, docs);
  })
}

exports.getContacts = function(req,res){
  db.collection(configs.collections.contacts).find({}).toArray(function(err, docs) {
    status.handleResponse(res,docs);
  });
}

exports.getTokens = function(req,res){
  db.collection(configs.collections.token).find({}).toArray(function(err, docs) {
    status.handleResponse(res,docs,201);
  });
}

exports.registerUser = function(req,res){
  exports.getUserByEmail(req.body.email, function(docs){
    if(docs.length == 0){
      db.collection(configs.collections.contacts).insertOne(req.body, function(err, doc) {
        status.handleResponse(res, doc.ops[0]);
      });
    }else{
      status.handleResponse(res, configs.messages.databasePostEmail);
    }
  });
}

exports.deleteUser = function(req,res){
  db.collection(configs.collections.contacts).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      status.handleError(res, err.message, configs.messages.databaseDelete);
    } else {
      status.handleResponse(res);
    }
  });
}

exports.getContactById = function(req,res){
  db.collection(configs.collections.contacts).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err || undefined || null) {
      status.handleError(res, err.message, configs.messages.databaseGet);
    } else {
      status.handleResponse(res, doc);
    }
  });
}

exports.updateUser = function(req,res){
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(configs.collections.contacts).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      status.handleError(res, err.message, configs.messages.databaseUpdate);
    } else {
      status.handleResponse(res);
    }
  });
}

module.exports = exports;