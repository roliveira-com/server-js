var express = require("express");
var bodyParser = require("body-parser");
var route = require('./routes')
var auth = require('./auth')
var upload = require('./upload');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());

route.connect(function() {

  app.get('/api/tokens', route.getTokens);

  app.post('/api/login', route.login);

  app.get('/api/contacts', route.getContacts);

  app.get('/api/projects', cors(), route.getProjects);

  app.get('/api/contacts/:id', route.getContactById);

  app.put('/api/contacts/:id', route.provideAuthorization, route.updateUser)

  app.post('/api/contacts', route.provideAuthorization, route.registerUser);

  app.post('/api/projects', route.registerProject);

  app.delete('/api/contacts/:id', route.deleteUser);

  app.post('/api/upload/avatar/:id', route.provideAuthorization, upload.formAvatar, route.saveAvatar);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Servidor disponível na porta: ", port);
  });
});


