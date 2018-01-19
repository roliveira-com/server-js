var status = require('../status');
var configs = require('../configs');

exports.getData = function(res, db, collection, callback){
  db.collection(collection).find({}).toArray(function(err, docs) {
    if(err){
      status.handleError(res, err.message, configs.messages.databaseGet);
    }else{
      callback(docs);
    }
  });
};

exports.searchData = function(search, res, db, collection, callback){
  db.collection(collection).find(search).toArray(function(err, doc) {
    if(err){
      status.handleError(res, err.message, configs.messages.databaseGet);
    }else{
      callback(doc);
    }
  });
};

exports.insertData = function(data, res, db, collection, callback){
  db.collection(collection).insertOne(data, function(err, doc) {
    if(err){
      status.handleError(res, err.message, configs.messages.databaseGet);
    }else{
      callback(doc);
    }
  });
}

exports.deleteData = function(item, res, db, collection, callback){
  db.collection(collection).deleteOne(item, function(err, result) {
    if (err) {
      status.handleError(res, err.message, configs.messages.databaseDelete);
    } else if (result.deletedCount == 0){
      status.handleError(res, "ID INEXISTENTE", configs.messages.databaseNoId);
    } else {
      callback(result);
    }
  });
}

exports.updateData = function(update, item, res, db, collection, callback){
  var updateDoc = update;
  delete updateDoc._id;
  db.collection(collection).updateOne(item, update, function(err, doc) {
    if (err) {
      status.handleError(res, err.message, configs.messages.databaseUpdate);
    } else if (doc.matchedCount == 0){
      status.handleError(res, "ID INEXISTENTE", configs.messages.databaseNoId);
    } else {
      callback(doc);
    }
  });
}
