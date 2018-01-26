var express = require("express");
var bodyParser = require("body-parser");
var route = require('./routes')
var auth = require('./auth')
var upload = require('./upload');

var app = express();
app.use(bodyParser.json());

route.connect(function() {

  app.get('/api/tokens', route.getTokens);

  app.post('/api/login', route.login);

  app.get('/api/contacts', route.getContacts);

  app.get('/api/contacts/:id', route.getContactById);

  app.put('/api/contacts/:id', route.provideAuthorization, route.updateUser)

  app.post('/api/contacts', route.provideAuthorization, route.registerUser);

  // app.post('/api/upload/avatar/:id', route.provideAuthorization, upload.uploadAvatar, route.saveAvatar);

  app.post('/api/upload/avatar', upload.form, route.theAvatar);

  app.delete('/api/contacts/:id', route.deleteUser);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Servidor disponível na porta: ", port);
  });
});


