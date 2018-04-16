var socket = require("socket.io");
var database = require('../database')

function socketConnection(socket){
  socket.join('projects');

  // socket.on('newproject', function(data) {
  //   database.insertSocketData(data, db, Collection, function(resp){
  //     socket.to('projects').emit('projectadded', resp.ops[0]);
  //   })
  // });

  socket.on('disconnect', function(){
    console.log('usuário ' + socket.id + ' desconectado.');
  });

  console.log('usuário ' + socket.id + ' conectado.');
};

exports.init = function (server, namespace){
  socket = socket.listen(server);
  var projectsSocket = socket.of(namespace);
  projectsSocket.on('connection', socketConnection);  
  return socket;
};