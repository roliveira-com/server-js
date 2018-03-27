var mongoose = require('mongoose');
var configs  = require('../configs');
var User     = require('../model/User');

var DATABASE;
var exports = {}; 

exports.connect = function(callback) {
  mongoose.connect( configs.database.uri, function(err, database) {
    if( err ) throw err;
    db = database;
    callback();
  });
}
