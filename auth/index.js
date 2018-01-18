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
    var date = new Date();
    db.collection(TABLE.collections.token).insertOne({
      email: req.body.email,
      token: token,
      created: date.getTime(),
      expire: date.getTime() + 300000 //5mins - 3600000/1hr - 86400000/1d
    }, function(err, doc) {
      if (err) {
        throw err;
      }
    })
  }
}

exports.handleAuthorization = function (req, res, next, docs) {
  const token = exports.extractToken(req);
  var now = new Date()
  if (!token) {
    res.setHeader('WWW-Authenticate', 'Bearer token_type="JWT"');
    res.status(401).json({ 'error': 'Você precisa se autenticar' });

  } else if (docs.length > 1){
    return error.handleError(res, "TOKEN DUPLICADO", "Seu login não foi possível. Contate-nos", 500);

  } else if ( docs[0] == undefined || docs[0] == null){
    return error.handleError(res, "FORBBIDEN", "Token Expirado. Faça um novo login", 403);

  } else if (token == docs[0].token && docs[0].expire >= now.getTime() ){
    next();

  } else {
    return error.handleError(res, "FORBBIDEN", "Token inválido ou expirado", 403);
  }
}

exports.extractToken = function (req) {
  let token = undefined;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  return token;
}