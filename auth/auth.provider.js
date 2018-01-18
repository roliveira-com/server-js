
var error = require('../error/handle-error');

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