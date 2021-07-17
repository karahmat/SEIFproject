const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
console.log(publicPath);

//We also need to specify a port our app is going to run on. Let's go with 3000
const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
//Lastly, we set up our socketIO connection
const io = socketIO(server);

//We need to set our express server to finally serve the content
app.use(express.static(publicPath));

app.get("/", (req,res) => {
    res.sendFile(publicPath+"/index.html");
});

app.get("/about",(req,res) => {
    res.sendFile(publicPath+"/about.html");
});

app.get("/onePlayer",(req,res) => {
    res.sendFile(publicPath+"/onePlayer.html");
});



server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});


const roomClients = {}; //an object, key is the room, value is the clientIDs (an arrray)
const clientRooms = {}; //an object, key is the clientID, value is the room.
const noOfPlayersInARoom = {};


io.on('connection', (socket) => {
    
    console.log("user connected: "+socket.id);
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    })

    socket.on("newGame", (data) => {
                
        let roomName = makeId(5);
        console.log(data.playerOneName);
        socket.playerName = data.playerOneName;
        //socket.number = data.noOfPlayers;                      
        roomClients[roomName] = [socket]; //object of rooms as index
        clientRooms[socket.id] = roomName; //object of clients.id as index
        noOfPlayersInARoom[roomName] = data.noOfPlayers;
        socket.emit('gameCode',{
            gameCode: roomName            
        });
        socket.join(roomName);        
    });

    socket.on("joinGame", (data) => {
        console.log(data.playerName);
        socket.playerName = data.playerName;        
        roomClients[data.codeFrmClient].push(socket); //object of rooms as index
        clientRooms[socket.id] = data.codeFrmClient;        
        socket.join(data.codeFrmClient);                
        
        
        if (roomClients[data.codeFrmClient].length < noOfPlayersInARoom[data.codeFrmClient]) {
            io.in(clientRooms[socket.id]).emit("status", false);
        } else if (roomClients[data.codeFrmClient].length == noOfPlayersInARoom[data.codeFrmClient]) {
            console.log(socket.id);
            io.to(socket.id).emit("status", true);            
        }
    });

    socket.on("startGameNow", (data) => {
        const randomIndexWord = Math.floor(Math.random()*data.totalWords);
        for (let i=0; i<parseInt(noOfPlayersInARoom[data.codeFrmClient]); i++) {
            if (i == 0) {
                io.to(roomClients[data.codeFrmClient][i].id).emit("playerData", {
                    indexWord: randomIndexWord,
                    clientID: roomClients[data.codeFrmClient][i].id,
                    playerID: i,
                    playerName: roomClients[data.codeFrmClient][i].playerName,
                    whoseTurn: roomClients[data.codeFrmClient][0].playerName,
                    canStart: true,
                    noOfPlayers: parseInt(noOfPlayersInARoom[data.codeFrmClient]),  
                    playerTurn: true                                                             
                });
            } else if (i>0) {
                io.to(roomClients[data.codeFrmClient][i].id).emit("playerData", {
                    indexWord: randomIndexWord,
                    clientID: roomClients[data.codeFrmClient][i].id,
                    playerID: i,
                    playerName: roomClients[data.codeFrmClient][i].playerName,
                    whoseTurn: roomClients[data.codeFrmClient][0].playerName,
                    canStart: true, 
                    noOfPlayers: parseInt(noOfPlayersInARoom[data.codeFrmClient]),  
                    playerTurn: false                                        
                });
            }
        }
    })


    socket.on("spinWheelTimer", (timer) => {        
        io.in(clientRooms[socket.id]).emit("timerReturn",timer);
    });

    socket.on("updateScore", (scores) => {
        console.log("updateScore " + socket.id);           
        socket.in(clientRooms[socket.id]).emit("otherPlayerScore",scores);
    });

    
    socket.on("togglePlayer", (playerIndexFrmClient) => {    
        console.log("toggled " + socket.id);
        const indexWhoseTurn = (playerIndexFrmClient+1)%noOfPlayersInARoom[clientRooms[socket.id]];        
        io.in(clientRooms[socket.id]).emit("toggleFromServer", {
            indexFrmServer: indexWhoseTurn,
            whoseTurnFrmServer: roomClients[clientRooms[socket.id]][indexWhoseTurn].playerName
        });      
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