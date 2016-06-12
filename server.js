var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var GPIO = require('onoff').Gpio;

// LEDs
var red = new GPIO(18, 'out');
var green = new GPIO(23, 'out');
var yellow = new GPIO(24, 'out');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('New connection ' + socket.id);
  socket.emit('red', {value:red.readSync()});
  socket.emit('green', {value: green.readSync()});
  socket.emit('yellow', {value: yellow.readSync()});

  socket.on('red', function(data){
    red.writeSync(data.value);
    socket.broadcast.emit('red', data);
  });
  socket.on('green', function(data){
    green.writeSync(data.value);
    socket.broadcast.emit('green', data);
  });
  socket.on('yellow', function(data){
    yellow.writeSync(data.value);
    socket.broadcast.emit('yellow', data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

