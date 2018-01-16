"use strict";
exports.__esModule = true;

var auth_jwt = require("jsonwebtoken");

exports.handleAuthorization = function(req, resp, next) {
  const token = extractToken(req);
  if (!token) {
    resp.setHeader('WWW-Authenticate', 'Bearer token_type="JWT"');
    resp.status(401).json({ 'error': 'Você precisa se autenticar' });
  } else {
    auth_jwt.verify(token, 'server-api-pass', (error, decoded) => {
      if (decoded) {
        next();
      } else {
        return error.handleError(res, "FORBBIDEN", "Não Autorizado");
      }
    })
  }
}

function extractToken(req) {
  let token = undefined;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  return token;
}