var express = require("express");
var bodyParser = require("body-parser");
var route = require('./routes')
var auth = require('./auth')
var upload = require('./upload');

var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

route.connect(function() {

  app.get('/api/tokens', route.getTokens);

  app.post('/api/tokens/refresh', route.tokenRefresh);

  app.post('/api/login', route.login);

  app.get('/api/users', route.getContacts);

  app.get('/api/projects', route.getProjects);
  
  app.get('/api/jobs', route.provideAuthorization, route.getJobs);
  
  app.get('/api/theme/:company', route.getTheme);

  app.get('/api/user/:id', route.provideAuthorization, route.getContactById);

  app.put('/api/contacts/:id', route.provideAuthorization, route.updateUser)

  app.post('/api/projects', route.provideAuthorization, route.AddProject);

  app.post('/api/contacts', route.provideAuthorization, route.registerUser);

  app.delete('/api/contacts/:id', route.provideAuthorization, route.deleteUser);

  app.post('/api/upload/avatar/:id', route.provideAuthorization, upload.formAvatar, route.saveAvatar);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Servidor disponível na porta: ", port);
  });
});


