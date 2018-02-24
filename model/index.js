crypto = require('crypto');

exports.User = function (f_name, l_name, email, pass) {
  var new_user =  
  {
    nome: f_name,
    sobrenome: l_name,
    email: email,
    senha: exports.hash(pass),
    created: Date.now()
  }
  
  if(!exports.validateModel(new_user)) return {invalid_model : true};

  return new_user;
}

exports.Project = function (titulo, descricao='adicione uma inscrição', status='inactive') {
  var new_project =
    {
      title: titulo,
      description: descricao,
      status: status,
      created: Date.now()
    }
  if (!exports.validateModel(new_project)) return { invalid_model: true };

  return new_project;
}

exports.validateModel = function (model) {
  for (prop in model) {
    if (model[prop] == undefined || model[prop] == null || model[prop] == "") return false;
  }
  return true
}

exports.hash = function (password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

