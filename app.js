const express = require('express');
const socketIo = require('socket.io');
const { Chess } = require('chess.js');
const http = require('http');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const chess = new Chess();
let players = {};
let currentplayer = 'w';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { titel: "Chess Game" });
});

io.on("connection", function (socket) {
    console.log('A user connected: ' + socket.id);
    if(!players.white){
        players.white=socket.id;
        socket.emit('colorAssignment', 'w');
    }
    else if(!players.black){
        players.black=socket.id;
        socket.emit('colorAssignment', 'b');
    }else{
        socket.emit("spectator role")
    }
})



server.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 