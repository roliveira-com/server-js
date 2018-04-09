var express     = require("express");
var http        = require("http");
var path        = require("path");
var socket      = require("socket.io");
var bodyParser  = require("body-parser");
var route       = require('./routes')
var auth        = require('./auth')
var upload      = require('./upload');

var app         = express();
var server      = http.createServer(app);
var io          = socket.listen(server);

// configurando conexão do socket específicamente para esta rota
var projectSocket = io.of('/api/projects');


app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

route.connect(io, function() {

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

  projectSocket.on('connection', function(socket) {

    socket.join('projects');

    console.log('usuário ' + socket.id + ' conectado.');

    socket.on('newproject', function(data) {
      route.AddSocketProject(data, function(resp){
        projectSocket.to('projects').emit('projectadded', resp.ops[0]);
        // Com o parâmetro 'broadcast', o evento é transmitido para todos conectados mesno esta
        // projectSocket.broadcast.to(data.room).emit('projectadded', resp.ops[0]);
      })
    });

    socket.on('disconnect', function(){
      console.log('usuário ' + socket.id + ' desconectado.');
    });
  
  });
});



