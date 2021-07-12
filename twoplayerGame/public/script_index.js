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

//form controls
const form = document.querySelector("#form");
const newGameButton = document.querySelector("#newGameButton");
const joinGameButton = document.querySelector("#joinGameButton");
const gameCodeInput = document.querySelector("#gameCodeInput");
const gameCodeDisplay = document.querySelector("#gameCodeDisplay");
const playerDiv = document.querySelector("#player");

newGameButton.addEventListener("click", () => {
    socket.emit("newGame");
    // init();
});

joinGameButton.addEventListener("click", () => {
    const code = gameCodeInput.value;
    socket.emit("joinGame", {
        totalWords: originalWord.length,
        codeFrmClient: code
    });
    // init();
});

socket.on("gameCode", (gameCode) => {
    gameCodeDisplay.innerText = gameCode;
});

socket.on("indexOfWord", (index) => {
    console.log(originalWord[index].title);
});

socket.on("playerData", (data) => {
    // console.log(data);
    console.log("My ID: "+data.clientID);
    console.log(data.playerTurn);
    playerDiv.style.display = "block";
    init(data.clientID, data.playerTurn, data.indexWord);
    if (data.playerTurn) {
        playerDiv.innerText = "MY TURN";        
    } else {
        playerDiv.innerText = "NOT MY TURN";
    }
    
});

socket.on("start", (msg) => console.log(msg));
