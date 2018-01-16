var login_jwt = require("jsonwebtoken");
var error = require('../error/handle-error');

exports.login = function(data, res){
  if (data.length == 0) {
    res.status(401).json({error: "Email não encontrado"})

  } else if (data.length != 1) {
    res.status(401).json({error: "Não foi possível efetuar o login, contate-nos"})

  } else if (data.length == 1) {
    if (user.senha == docs[0].senha) {
      var token = jwt.sign({ sub: docs[0].email, iss: 'server-api' }, 'server-api-pass');
      res.status(200).json({
        name: docs[0].nome,
        email: docs[0].email,
        token: token
      })
    } else {
      res.status(403).json({error: "Senha incorreta"})
    }
  }
}