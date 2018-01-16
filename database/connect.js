var async = require('async');
var mongo_database = require("mongodb").MongoClient;

var DATABASE_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"

var databases = {
  connect = async.apply(mongo_database.connect, DATABASE_URI)
}

module.exports = function(cb){
  async.parallel(databases, cb);
}