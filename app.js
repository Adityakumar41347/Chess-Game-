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
    socket.on('disconnect',()=>{
        if(socket.id===players.white){
            delete players.white;
        }
        else if(socket.id===players.black){
            delete players.black;
        }   
    })
    socket("move",(move)=>{
        try{
            if(chess.turn=='w' && socket.id!=players.white)return ;
            if(chess.turn=='b' && socket.id!=players.black)return ;
            const result=chess.move(move)
            if(result){
                 currentplayer=chess.turn();
                io.emit("move",move);
                io.emit('boardstate', chess.fen())
            }else{
                console.log("invalid move: ",move   );
                socket.emit("invalid move")
            }
        } catch(err){
            console.log("error: ",err);
            socket.emit("invalid move :",move)
        

        }
    })
})




server.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 