var express     = require("express");
var http        = require("http");
var socket      = require("socket.io");
var bodyParser  = require("body-parser");
var route       = require('./routes')
var auth        = require('./auth')
var upload      = require('./upload');

var app         = express();
var server      = http.createServer(app);
var io          = socket.listen(server);


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

io.on('connection', function(socket) {

  console.log('Socket connected');

  socket.on('newproject', function(project) {
    io.emit('newproject', project);
  });

  socket.on('projectupdated', function(projectedited) {
    io.emit('projectupdated', projectedited);
  });

});

route.connect(function() {

  app.get('/api/tokens', route.getTokens);

  app.post('/api/login', route.login);

  app.get('/api/contacts', route.getContacts);

  app.get('/api/projects', route.getProjects);

  app.get('/api/contacts/:id', route.getContactById);

  app.put('/api/contacts/:id', route.provideAuthorization, route.updateUser)

  app.post('/api/projects', route.AddProject);

  app.post('/api/contacts', route.registerUser);

  app.delete('/api/contacts/:id', route.provideAuthorization, route.deleteUser);

  app.post('/api/upload/avatar/:id', route.provideAuthorization, upload.formAvatar, route.saveAvatar);

  server.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Servidor disponível na porta: ", port);
  });
});


