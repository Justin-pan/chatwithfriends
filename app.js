var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app).listen(3000);
var io  = require('socket.io')(server);

var rooms = [];
var room;
app.use(express.static("./public"));

io.on('connection', function(socket){
  console.log("new connection");
  socket.emit('roomList', {rooms: rooms});
  socket.on('createRoom', function(data){
    var thereWasARoom = false;
    var room = {
      roomname: data.roomname,
      roompass: data.roompass
    };
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].roomname == room.roomname){
        thereWasARoom = true;
      }
    }
    if(thereWasARoom){
      socket.emit('badRoomName');
    }else{
      socket.emit('createRoomSuccessful');
      rooms.push(room);
    }
  });
  socket.on('joinRoom', function(data){
    var roomFound = false;
    for(var i = 0; i < rooms.length; i++){
      if(rooms[i].roomname == data.roomname){
        roomFound = true;
        if(rooms[i].roompass == data.roompass){
          socket.emit('joinRoomSuccessful');
        }else{
          socket.emit('badRoomPass');
        }
      }
    }
    if(!roomFound){
      console.log("you need to fix join room");
    }
  })
  socket.on('join', function(data){
    console.log("joined " + data.roomname);
    socket.join(data.roomname);
    io.in(data.roomname).emit('message', data.message);
  });
  socket.on('chat', function(data){
    socket.broadcast.to(data.roomname).emit('message', data.message);
  });

});
console.log("Running on 3000");
