var express = require("express");
var bodyParser = require("body-parser");
var route = require('./routes')
var auth = require('./auth')
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
var upload = require('./upload');
>>>>>>> Stashed changes
=======
var upload = require('./upload');
>>>>>>> d4bfaa637f139f0389ba405b8b918f6d3e8becc8

var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

route.connect(function() {

  app.get('/api/tokens', route.getTokens);

  app.post('/api/login', route.login);

  app.get('/api/contacts', route.getContacts);

<<<<<<< Updated upstream
=======
  app.get('/api/projects', route.getProjects);

>>>>>>> Stashed changes
  app.get('/api/contacts/:id', route.getContactById);

  app.put('/api/contacts/:id', route.provideAuthorization, route.updateUser)

  app.post('/api/contacts', route.provideAuthorization, route.registerUser);

  app.delete('/api/contacts/:id', route.provideAuthorization, route.deleteUser);

  app.post('/api/upload/avatar/:id', route.provideAuthorization, upload.formAvatar, route.saveAvatar);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Servidor disponível na porta: ", port);
  });
});


