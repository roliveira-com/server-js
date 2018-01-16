"use strict";
exports.__esModule = true;

var bodyParser  = require("body-parser");
var mongodb     = require("mongodb");
var jwt         = require("jsonwebtoken");

var error       = require('../error/handle-error');
var TABLE       = require('../configs/db-collections')

var login_db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  login_db = database;
  console.log("Conexão no Banco do Login Provider");
});

exports.handleLogin = function (req, res) {
  var user = req.body;

  if (!user.email || !user.senha) {
    return error.handleError(res, "DADOS INVÁLIDOS", "É necessário informar email e senha para efetuar o login", 400);
  }

  login_db.collection(TABLE.collections.contacts).find({ "email": user.email }).toArray(function (err, docs) {
    if (err) {
      return error.handleError(res, err.message, "Não foi possível acessar os dados");
    } else if (docs.length == 0) {
      return error.handleError(res, "Email não encontrado", "E-mail incorreto", 403);
    } else if (docs.length != 1) {
      return error.handleError(res, "Dados Duplicados", "Não foi possível efetuar o login, contate-nos");
    } else if (docs.length == 1) {
      if (user.senha == docs[0].senha) {
        var token = jwt.sign({ sub: docs[0].email, iss: 'server-api' }, 'server-api-pass');
        res.status(200).json({
          name: docs[0].nome,
          email: docs[0].email,
          token: token
        })
      } else {
        return error.handleError(res, "FORBIDDEN", "Senha incorreta", 403);
      }
    }
  });
}