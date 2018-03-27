var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema   = mongoose.Schema;


var SALT_WORK_FACTOR = 10;


var userSchema = new Schema({
  nome      : {type: String, required: true},
  sobrenome : {type: String, required: true},
  email     : {type: String, required: true, unique: true },
  senha     : {type: String, required: true},
  created   : Date.now(),
});


userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.senha, salt, function(err, hash) {
          if (err) return next(err);
          user.senha = hash;
          next();
      });
  });
});


userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.senha, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
