var status = require('../status');
var configs = require('../configs');

exports.getData = function(res, db, collection, callback){
  db.collection(collection).find({}).toArray(function(err, docs) {
    if(err){
      status.handleError(res, "err.message", configs.messages.databaseGet);
    }else{
      callback(docs);
    }
  });
};

exports.searchData = function(search, res, db, collection, callback){
  db.collection(collection).find(search).toArray(function(err, doc) {
    if(err){
      status.handleError(res, "err.message", configs.messages.databaseGet);
    }else{
      callback(doc);
    }
  });
};
