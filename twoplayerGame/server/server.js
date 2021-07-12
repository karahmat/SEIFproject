const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');

//We also need to specify a port our app is going to run on. Let's go with 3000
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
//Lastly, we set up our socketIO connection
const io = socketIO(server);

//We need to set our express server to finally serve the content
app.use(express.static(publicPath));

server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

const state = {};
const clientRooms = {};


io.on('connection', (socket) => {
    console.log("user connected: "+socket.id);
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    })

    socket.on("newGame", () => {
        let roomName = makeId(5);
        clientRooms[socket.id] = roomName;
        socket.emit('gameCode',roomName);
        socket.join(roomName);
        socket.number = 1;
        socket.emit('init',1);
    });

    socket.on("joinGame", (data) => {
        console.log(data);
        
        clientRooms[socket.id] = data.codeFrmClient;
        socket.join(data.codeFrmClient);
        socket.number = 2;
        socket.emit("init", 2);
        
        // io.emit("indexOfWord", Math.floor(Math.random()*data.totalWords));           
        io.to(Object.keys(clientRooms)[0]).emit("playerData", {
            indexWord: Math.floor(Math.random()*data.totalWords),
            clientID: Object.keys(clientRooms)[0],
            playerTurn: true,
        });
        
        io.to(Object.keys(clientRooms)[1]).emit("playerData", {
            indexWord: Math.floor(Math.random()*data.totalWords),
            clientID: Object.keys(clientRooms)[1],
            playerTurn: false,
        });

        

    });

});

//can be put in a utils function later on
function makeId(lengthInput) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i=0; i<lengthInput; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}