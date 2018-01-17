var jwt = require("jsonwebtoken");
var error = require('../error/handle-error');
var TABLE = require('../configs/db-collections');

exports.loginHandler = function(req,res,docs){

  if ( !req.body.email || !req.body.senha ) {
    return error.handleError(res, "DADOS INVÁLIDOS", "É necessário informar e-mail e senha para fazer o login");
  }

  if (docs.length == 0) {
    res.status(401).json({error: "Email não encontrado"})
  
  } else if (docs.length != 1) {
    res.status(401).json({error: "Não foi possível efetuar o login, contate-nos"})
  
  } else if (docs.length == 1) {
    if (req.body.senha == docs[0].senha) {
      var token = jwt.sign({ sub: docs[0].email, iss: 'server-api' }, 'server-api-pass');
      res.status(201).json({
        nome: docs[0].nome,
        email: docs[0].email,
        token: token
      });
      return token;
    } else {
      res.status(403).json({error: "Senha incorreta"})
    }
  }
}

exports.loginRegister = function(req, res, token, db){
  if(token){
    db.collection(TABLE.collections.token).insertOne({
      email: req.body.email,
      token: token,
      created: 'date',
      expire: 'date'
    }, function(err, doc) {
      if (err) {
        throw err;
      }
    })
  }
}