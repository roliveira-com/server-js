"use strict";
exports.__esModule = true;
var jsonserver = require("json-server");
var fs = require("fs");
var https = require("https");
var auth_1 = require("./auth");
var authorization_1 = require("./authorization");
var server = jsonserver.create();
var router = jsonserver.router('db.json');
var middlewares = jsonserver.defaults();
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonserver.bodyParser);
// middleware de login. Cria um token usando a spec JWT
server.post('/login', auth_1.handleAuth);
// middleware de autorização. Valida se o token gerado é válido
server.use('/orders', authorization_1.handleAuthorization);
// Use default router
server.use(router);
var options = {
    cert: fs.readFileSync('./backend/keys/cert.pem'),
    key: fs.readFileSync('./backend/keys/key.pem')
};
https.createServer(options, server).listen(3001, function () {
    console.log('JSON Server is running on https://localhost:3001');
});
