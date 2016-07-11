var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

var port = process.env.PORT || 3000;

server.listen(port,function(){
	console.log("Server running in port %s",port);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected ', connections.length);

    //Desconnect
    socket.on('disconnect',function(data){

			io.sockets.emit('disconnected', {user: socket.username});

      users.splice(users.indexOf(socket.username), 1);
      updateUsernames();

      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Send message
    socket.on('send message',function(data){
      io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New user
    socket.on('new user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    function updateUsernames(){
      io.sockets.emit('get users', users);
    }
});
