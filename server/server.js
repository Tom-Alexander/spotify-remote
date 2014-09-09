var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.use('/assets', express.static(__dirname + '/server/assets'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('modify-track', function (action) {
        io.emit(action);
    });

    socket.on('updateTrack', function (msg) {
        io.emit('track-modified', msg);
    });

});

http.listen(3000);
