crypto = require('crypto');

exports.User = function (name, f_name, email, pass) {
  var new_user =  
  {
    nome: name,
    sobrenome: f_name,
    email: email,
    senha: exports.hash(pass),
    created: Date.now()
  }
  if(exports.validModel(new_user)) return new_user;

  return false;
}

exports.validModel = function (model) {
  for (prop in model) {
    if (model[prop] == undefined || model[prop] == null || model[prop] == "") return false;
  }
  return true
}

exports.hash = function (password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

