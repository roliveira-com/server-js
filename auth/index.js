var jwt = require("jsonwebtoken");
var status = require('../status');
var configs = require('../configs');

exports.loginHandler = function(req,res,docs){

  if ( !req.body.email || !req.body.senha ) {
    return status.handleError(res, "DADOS INVÁLIDOS", configs.messages.loginParamsRequired);
  
  } else if (docs.length != 1) {
    status.handleError(res,"EMAIL DUPLICADO NA BASE", configs.messages.loginGeneric, 401);
  
  } else if (docs.length == 1) {

    if (req.body.senha == docs[0].senha) {
      var response = {
        nome: docs[0].nome,
        email: docs[0].email,
        uid: docs[0]._id,
        token: jwt.sign({ sub: docs[0].email, iss: configs.token.issuer }, configs.token.passcode )
      };
      status.handleResponse(res,response,201)
      return response.token;

    } else {
      status.handleError(res, "SENHA INCORRETA", configs.messages.loginPassword, 403);

    }
  }
}

exports.loginRegister = function(req, res, uid, token, db){
  if(token){
    var date = new Date();
    db.collection(configs.collections.token).insertOne({
      email: req.body.email,
      uid: uid,
      token: token,
      created: tokenHandler.created(),
      expire: tokenHandler.expire()
    }, function(err, doc) {
      if (err) {
        throw err;
      }
    })
  }
}

exports.handleAuthorization = function (req, res, next, docs) {
  let token = exports.extractToken(req);
  let now = new Date();
  if (!token) {
    res.setHeader('WWW-Authenticate', 'Bearer token_type="JWT"');
    status.handleError(res, "FORBIDDEN", configs.messages.authRequired, 401)

  } else if (docs.length > 1){
    return status.handleError(res, "TOKEN DUPLICADO", configs.messages.authGeneric, 500);

  } else if ( docs[0] == undefined || docs[0] == null){
    return status.handleError(res, "FORBBIDEN", configs.messages.tokenInvalid, 403);

  } else if (token == docs[0].token && docs[0].expire >= now.getTime() ){
    next();

  } else {
    return status.handleError(res, "FORBBIDEN", configs.messages.tokenExpired, 403);
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

var tokenHandler = {
  created : function(){
    var moment = new Date();
    return moment.getTime();
  },
  expire : function(){
    var expiration = this.created() + configs.token.expire;
    return expiration;
  }
}