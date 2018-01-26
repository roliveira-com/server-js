var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var auth = require('../auth');
var status = require('../status');
var configs = require('../configs');
var database = require('../database');
var upload = require('../upload');


var db;
var exports = {}

exports.connect = function(callback) {
  MongoClient.connect( configs.database.uri, function(err, database) {
    if( err ) throw err;
    db = database;
    callback();
  });
}

exports.login = function(req,res){
  database.searchData({"email":req.body.email}, res, db, configs.collections.contacts, function(docs){
    auth.loginRegister(req, res, auth.loginHandler(req,res,docs), db);
  });
};


exports.provideAuthorization = function (req, res, next) {
  database.searchData({ token : auth.extractToken(req) }, res, db, configs.collections.token, function(docs){
    auth.handleAuthorization(req, res, next, docs);
  });
};


exports.getContacts = function(req,res){
  database.getData(res, db, configs.collections.contacts, function(docs){
    status.handleResponse(res,docs);
  })
}


exports.getTokens = function(req,res){
  database.getData(res, db, configs.collections.token, function(docs){
    status.handleResponse(res,docs,201);
  });
};


exports.registerUser = function(req,res){
  database.searchData({email:req.body.email}, res, db, configs.collections.contacts, function(docs){
    if(docs.length == 0){
      database.insertData(req.body, res, db, configs.collections.contacts, function(doc){
        status.handleResponse(res, doc.ops[0]);
      });
    }else{
      status.handleError(res, "EMAIL JÁ CADASTRADO", configs.messages.databasePostEmail);
    };
  });
};


exports.deleteUser = function(req,res){
  database.deleteData({_id: new ObjectID(req.params.id)}, res, db, configs.collections.contacts, function(result){
    status.handleResponse(res);
  });
};


exports.getContactById = function(req,res){
  database.searchData({ _id: new ObjectID(req.params.id) }, res, db, configs.collections.contacts, function(doc){
    status.handleResponse(res, doc);
  })
}


exports.updateUser = function(req,res){
  database.updateData(req.body, {_id: new ObjectID(req.params.id)}, res, db, configs.collections.contacts, function(doc){
    status.handleResponse(res);
  });
}

exports.saveAvatar = function(req,res){

  if (!req.file || !req.params.id){
    return status.handleError(res,"DADOS INVÁLIDOS",configs.messages.UploadParamsRequired);
  };

  database.searchData({_id: new ObjectID(req.params.id)}, res, db, configs.collections.contacts, function(docs){
    if(docs.length == 0){
      status.handleError(res,"USUÁRIO NÃO ENCONTRADO", configs.messages.databaseNoId);

    } else if(docs.length == 1){
      docs[0].avatar = req.file.location;
      database.updateData(docs[0], { _id: new ObjectID(req.params.id)}, res, db, configs.collections.contacts, function(doc){
        status.handleResponse(res);
      });

    }else{
      status.handleError(res,"USUÁRIO DUPLICADO", configs.messages.databaseUpdate)
    };
  });

};

exports.theAvatar = function(req,res){
  console.log(req.file);
  // upload.uploadAvatar(req, res);
  // database.searchData({_id: new ObjectID(req.body.uid)}, res, db, configs.collections.contacts, function(doc){
  //   if(doc.length == 1){
  //     upload.uploadAvatar(req, res, db, doc, configs.collections.contacts);
  //   }
  // })
  // doc[0].avatar = req.file.location;
  // doc[0].owner = req.body.uid;
  // res.status(201).json({"success": doc[0]})
}

module.exports = exports;