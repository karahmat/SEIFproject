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


const roomClients = {}; //an object, key is the room, value is the clientIDs (an arrray)
const clientRooms = {}; //an object, key is the clientID, value is the room.



io.on('connection', (socket) => {
    
    console.log("user connected: "+socket.id);
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    })

    socket.on("newGame", () => {
        
        let roomName = makeId(5);             
        roomClients[roomName] = [socket]; //object of rooms as index
        clientRooms[socket.id] = roomName;
        socket.emit('gameCode',roomName);
        socket.join(roomName);
        socket.number = 1;
        socket.emit('init',1);
    });

    socket.on("joinGame", (data) => {
       
        roomClients[data.codeFrmClient].push(socket); //object of rooms as index
        clientRooms[socket.id] = data.codeFrmClient;        
        socket.join(data.codeFrmClient);
        socket.number = 2;
        socket.emit("init", 2);
        const randomIndexWord = Math.floor(Math.random()*data.totalWords);
        

        // io.emit("indexOfWord", Math.floor(Math.random()*data.totalWords));           
        io.to(roomClients[data.codeFrmClient][0].id).emit("playerData", {
            indexWord: randomIndexWord,
            clientID: roomClients[data.codeFrmClient][0].id,
            playerID: "Player 1",
            playerTurn: true,
        });
        
        io.to(roomClients[data.codeFrmClient][1].id).emit("playerData", {
            indexWord: randomIndexWord,
            clientID: roomClients[data.codeFrmClient][1].id,
            playerID: "Player 2",
            playerTurn: false,
        });
        
        

    });

    socket.on("spinWheelTimer", (timer) => {        
        io.in(clientRooms[socket.id]).emit("timerReturn",timer);
    });

    socket.on("updateScore", (scores) => {
        console.log("updateScore " + socket.id);           
        io.in(clientRooms[socket.id]).emit("otherPlayerScore",scores);
    });

    
    socket.on("togglePlayer", () => {    
        console.log("toggled " + socket.id);        
        io.in(clientRooms[socket.id]).emit("toggleFromServer");      
    });

              
    socket.on("consonant",(letter) => {
        console.log(socket.id + " " + letter);
        io.in(clientRooms[socket.id]).emit("consonantServer",letter);
    });
    
    
    socket.on("vowel",(vowelLetter) => {
        console.log(socket.id + " " + vowelLetter);
        io.in(clientRooms[socket.id]).emit("vowelServer",vowelLetter);
    });

    socket.on("solveValue", (solveInput) => {
        console.log("solve "+socket.id);
        io.in(clientRooms[socket.id]).emit("solveInputFromServer",solveInput);
    });

    socket.on("playAgainRandomNo", (playAgainWordsLength) => {
        const randomNoPlayAgain = Math.floor(Math.random()*playAgainWordsLength);
        io.in(clientRooms[socket.id]).emit("playAgainIndexWord",randomNoPlayAgain);

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