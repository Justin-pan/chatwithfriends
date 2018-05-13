var username = "blank";
var roomname;
var roompass;
function userPrompt(){
  username = prompt("Please enter your username", "blank");
}

var socket = io("http://localhost:3000");

socket.on('roomList', function(data){
  var len = data.rooms.length;
  for(var i = 0; i < len; i++){
    var $form = $('<form>').append(
      $('<h1>').html(data.rooms[i].roomname).addClass(),
      $('<br>'),
      $('<input>', {
        type: 'password',
        placeholder: 'Room password',
        name: 'password'
      }),
      $('<br>'),
      $('<input>', {
        type: 'submit',
        value: 'Join',
      })
    ).addClass("joinroom").attr('action', 'javascript:void(0)');
    $('.roomlist').append($('<li>').append($form));
  }
});

$('#createRoom').submit(function(){
  var values = $(this).serializeArray();
  roomname = values[0].value;
  roompass = values[1].value;
  socket.emit('createRoom', {roomname: roomname, roompass: roompass});
});

socket.on('badRoomName', function(){
  alert("Please enter a different room name");
});

socket.on('createRoomSuccessful', function(){
  $('.roomname').html(roomname);
  $('.menu').css('display', 'none');
  $('.chatroom').css('display', 'block');
  var msg = username + " has connected!";
  socket.emit('join', {message: msg, roomname: roomname});
});

$(document).on('submit', '.joinroom', function(){
  roomname = $(this).find('h1').html();
  var password = this.password.value;
  socket.emit('joinRoom', {roomname: roomname, roompass: password});
})

socket.on('joinRoomSuccessful', function(){
  $('.roomname').html(roomname);
  $('.menu').css('display', 'none');
  $('.chatroom').css('display', 'block');
  var msg = username + " has connected!";
  socket.emit('join', {message: msg, roomname: roomname});
});

socket.on('badRoomPass', function(){
  alert("Please enter a different room name");
});

socket.on('message', function(data){
  printMessage(data);
});

$('#messageform').submit(function(){
  console.log("I'm submitting");
  var input = this.message.value;
  console.log(input);
  var msg = username + ": " + input;
  this.reset();
  printMessage(msg);
  socket.emit('chat', {message: msg, roomname: roomname});
});

$('#discon').click(function(){
  var msg = username + ' has diconnected';
  socket.emit('chat', msg);
  printMessage("You have disconnected");
  socket.close();
});

function printMessage(msg){
  var $p = $('<p>').html(msg);
  $('.messages').append($p);

}
