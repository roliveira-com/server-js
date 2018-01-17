var express = require("express");
var database = require('./database')
var bodyParser = require("body-parser");
var initdb = require('./database')
var auth = require('./auth/auth.provider')


var app = express();
app.use(bodyParser.json());

database.connect(function() {

  app.get('/api/tokens', database.getTokens);

  app.post('/api/login', database.login);

  app.get('/api/contacts', database.getContacts);

  app.get('/api/contacts/:id', database.getContactById);

  app.put('/api/contacts/:id', auth.handleAuthorization, database.updateUser)

  app.post('/api/contacts', auth.handleAuthorization, database.registerUser);

  app.delete('/api/contacts/:id', auth.handleAuthorization, database.deleteUser);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


