// //add socket
// const socket = io("http://localhost:3000");
// socket.on("connection");


//animate the navigation bar
const toggleButton = document.querySelector(".navbar-toggle");
const navBarLinks = document.querySelectorAll(".navbar-links");
toggleButton.addEventListener("click", () => {
    for (let i=0; i<navBarLinks.length; i++) {
        navBarLinks[i].classList.toggle("active");
    }
});

//animate the instruction bar
const instructionHeader = document.querySelector("#instructions > h2");
const orderedLists = document.querySelector(".instructionToggle");
instructionHeader.addEventListener("click", () => {
    //console.log(orderedLists);
    orderedLists.classList.toggle("active1");
});

//form controls

const newGameButton = document.querySelector("#newGameButton");
const joinGameButton = document.querySelector("#joinGameButton");
const gameCodeInput = document.querySelector("#gameCodeInput");
const gameCodeDisplay = document.querySelector("#gameCodeDisplay");
const noOfPlayers = document.querySelector("#noOfPlayers");
const playerOneName = document.querySelector("#playerOneName");
const otherPlayerName = document.querySelector("#otherPlayerName");
const waitingPlayer = document.querySelector("#waitingPlayer");
const startGameButton = document.querySelector("#startGameButton");

newGameButton.addEventListener("click", () => {
    let playerInputName;
    if (playerOneName.value === "") {
        playerInputName = "Player 1";
    } else {
        playerInputName = playerOneName.value;
    }
    socket.emit("newGame", {
        playerOneName: playerInputName,
        noOfPlayers: noOfPlayers.value
    });
    
});

socket.on("gameCode", (data) => {    
    gameCodeDisplay.innerText = data.gameCode;
});

joinGameButton.addEventListener("click", () => {
    let playerInputName;
    if (otherPlayerName.value === "") {
        playerInputName = "Player Others";
    } else {
        playerInputName = otherPlayerName.value;
    }
    const code = gameCodeInput.value;
    socket.emit("joinGame", {
        playerName: playerInputName,        
        codeFrmClient: code
    });    
});

socket.on("status", (data) => {
    if (data === false) {
        waitingPlayer.innerText = "Waiting for Third Player";
        waitingPlayer.style.color = "white";    
    } else if (data === true) {
        waitingPlayer.style.display = "none";
        startGameButton.style.display = "block";
    }
});

startGameButton.addEventListener("click", () => {
    socket.emit("startGameNow", {
        totalWords: originalWord.length,
        codeFrmClient: gameCodeInput.value
    });
});


socket.on("playerData", (data) => {
    
    playerDiv.style.display = "block";
        
    init(data.indexWord, data.noOfPlayers, data.playerID);
    player1 = new Player(data.clientID, data.playerID, data.playerName, data.playerTurn, data.whoseTurn, data.noOfPlayers);
    playGame(player1);

    if (data.playerTurn) {
        playerDiv.innerText = "My Turn";                
    } else {
        playerDiv.innerText = data.whoseTurn + "\'s Turn";
    }
    
    
});

