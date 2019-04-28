var jwt = require("jsonwebtoken");
var status = require('../status');
var configs = require('../configs');
var hash = require('../model').hash;

exports.loginHandler = function(req,res,docs){

  if ( !req.body.email || !req.body.senha ) {
    return status.handleError(res, "DADOS INVÁLIDOS", configs.messages.loginParamsRequired);
  
  } else if (docs.length != 1) {
    status.handleError(res,"EMAIL DUPLICADO NA BASE", configs.messages.loginGeneric, 401);
  
  } else if (docs.length == 1) {

    if (hash(req.body.senha) == docs[0].senha) {
      return exports.authCredentials(false, docs);

    } else {
      return status.handleError(res, "SENHA INCORRETA", configs.messages.loginPassword, 403);

    }
  }
}

exports.authCredentials = function(decoded = undefined, docs = undefined){
  return {
    user: decoded ? decoded.sub : docs[0]._id,
    token: jwt.sign({
      sub: decoded ? decoded.sub : docs[0]._id,
      iss: configs.token.issuer,
      exp: Math.floor(Date.now() / 1000) + (60 * 1)
    }, configs.token.passcode),
    refreshToken: jwt.sign({
      sub: decoded ? decoded.sub : docs[0]._id,
      iss: configs.token.issuer,
      exp: Math.floor(Date.now() / 1000) + (60 * 2)
    }, configs.token.passcode),
  }
}

exports.tokenRefresh = function(req,res){
  if (!req.body.refreshToken) {
    return status.handleError(res, "FORBIDDEN", configs.messages.authRequired, 401)
  } else {
    const token = exports.extractToken(req);
    jwt.verify(token, configs.token.passcode, function (err, decoded) {
      if (err) {
        return status.handleError(res, "FORBBIDEN", configs.messages.tokenExpired, 403);
      }
      status.handleResponse(res, exports.authCredentials(decoded, false), 200);
    });
  }
}

exports.handleAuthorization = function (req, res, next) {
  const token = exports.extractToken(req);
  if(!token){
    status.handleError(res, "FORBIDDEN", configs.messages.authRequired, 401)
  } else {
    jwt.verify(token, configs.token.passcode, function (err, decoded) {
      if(err){
        return status.handleError(res, "FORBBIDEN", configs.messages.tokenExpired, 403);
      }
      next();
    })
  }
}

exports.splitToken = function(token){
  const parts = token.split('.');
  return parts[2];
}

exports.joinToken = function(token){
  const issuer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.";
  const passcode = "eyJzdWIiOiI1YTkxYjEzMGVlOTY5NTFkN2E2NDlkMGYiLCJpc3MiOiJyb2xpdmVpcmEtYXBpIiwiZXhwIjoxNTU2MjQ3NTc0LCJpYXQiOjE1NTYyNDc1MTR9.";
  return issuer + passcode + token;
}

exports.extractToken = function (req) {
  let token = undefined;
  if (req.body.refreshToken) {
    return req.body.refreshToken;
  } else if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  return token;
}
