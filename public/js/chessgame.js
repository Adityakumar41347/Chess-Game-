const socket=io();

socket.emit('joinGame');
socket.on("gamestart",()=>{
    console.log("Game Started");
});