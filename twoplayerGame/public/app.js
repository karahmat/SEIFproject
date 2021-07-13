//add socket
const socket = io("http://localhost:3000");
socket.on("connection");

class Word {
    constructor(letters, category) {
        this.letters = letters.toUpperCase();
        this.category = category.toUpperCase();
        this.uniqueChar = []; //initialise array to store all my unique characters
        this.charIndex = {};
        this.startWord = [];
        this.uniqueCharCount = 0;
        //this.arrIndexLetters = arrIndexLetters;        
    }

    getUniqueLetters() {
        const arrStrings = this.letters.split("");
        //let uniqueChar = []; 
  
        for (let i=0; i<arrStrings.length; i++) {
          if (this.uniqueChar.indexOf(arrStrings[i]) == -1) {
            this.uniqueChar.push(arrStrings[i]);
            this.uniqueCharCount++;
            }
        }

        

        for (let i=0; i<this.uniqueChar.length; i++) {
            let indices = [];
            for (let j=0; j<this.letters.length; j++) {
                if(this.letters[j] == this.uniqueChar[i]) {
                    indices.push(j);
                }
            }
            this.charIndex[this.uniqueChar[i]] = indices;
        }
             
        
    }

    arrangeLetters() {
        let displayObject = {row1: [], row2:[], row3:[], row4:[], row5:[]};
        let rowNum = 1;
        let currentRowRemainder = 13;
        const splitWords = this.letters.split(" ");

        for (let i = 0; i < splitWords.length; i++) {
            if (currentRowRemainder - splitWords[i].length >= 0) {
            displayObject[`row${rowNum}`].push(splitWords[i]);
            currentRowRemainder -= splitWords[i].length+1; //+1 to account for blank space between each word
            } else {
            rowNum++;
            currentRowRemainder = 13;
            displayObject[`row${rowNum}`].push(splitWords[i]);
            currentRowRemainder -= splitWords[i].length+1; //+1 to account for blank space between each word
            }
        }

        const noRows = 5;
        //const noBlocksPerRow = 13;
        
        for (let i=1; i<=noRows; i++) {
            
            let joinedWords = displayObject["row"+i].join(" ");
            const row = document.querySelector("#row"+i); 
            for (let j=0; j<joinedWords.length; j++) {
                
                if (joinedWords[j] !== " ") {                
                row.querySelectorAll(".square")[j].style["background-color"] = "#67c50a";
                row.querySelectorAll(".square")[j].setAttribute("letter", joinedWords[j]);                           
                }
            }
        }
    }

    setCategory() {
        const categoryDiv = document.querySelector(".category");
        categoryDiv.innerText = this.category;
    }


}

class Player {
    constructor(clientID,name,isTurn) {
        this.clientID = clientID;
        this.name = name;
        this.score = 0;        
        this.health = 0;
        this.accScore = 0;
        this.isTurn = isTurn;
    }

    updateAccScore() {
        this.accScore = this.accScore + this.score;
    }

    
}

//DOM elements
const scoreBoard1 = document.querySelector(".p1-score");
const healthBoard1 = document.querySelector(".p1-health");
const accScoreBoard1 = document.querySelector(".p1-accScore");
const scoreBoard2 = document.querySelector(".p2-score");
const healthBoard2 = document.querySelector(".p2-health");
const accScoreBoard2 = document.querySelector(".p2-accScore");
const wheel = document.querySelector(".wheel");
const startButton = document.querySelector("#spinButton-container");
const resultShow = document.querySelector(".results");
const userInput = document.querySelector("#user-input");
const vowelButton = document.querySelector("#vowelButton");
const solveButton = document.querySelector("#solveButton");
const consonantButton = document.querySelector("#consonantButton");
const letterResults = document.querySelector(".letter-results");
const consonantDiv = document.querySelector(".consonant");
const vowelDiv = document.querySelector(".vowel");
const spinAgainDiv = document.querySelector(".spinAgain");
const spinagainButton = document.querySelector("#spinagainButton");
const anotherRoundDiv = document.querySelector("#anotherRoundDiv");
const playAgainButton = document.querySelector("#playAgainButton");


function makeSquares() {
    const noRows = 5;
    const noBlocksPerRow = 13;
    let newRow;
    
    for (let i=1; i<=noRows; i++) {
        newRow = document.createElement("div");
        newRow.setAttribute("id", ("row"+i));
        newRow.className = "rowWords";
        newRow.style.display = "flex";
        document.querySelector('#words-container').append(newRow);
        
        for (let j=1; j<=noBlocksPerRow; j++) {
        const square = document.createElement('div');
        square.className = "square";           
        document.querySelector("#row"+i).append(square);
        }
    }
}

//function to rebuild the drop down menu of consonants and vowels
function rebuildDropDown() {
    //remove and rebuild vowel dropdown
    const vowelDropDown = document.querySelector("#vowelValue");
    vowelDropDown.innerHTML = "";
    const vowels = ["A", "E", "I", "O", "U"];
    
    for (const vowel of vowels) {
        const option = document.createElement("option");
        option.setAttribute("id","letter"+vowel);
        option.setAttribute("value",vowel);
        option.innerText = vowel;
        vowelDropDown.append(option);
    }
    
    //remove and rebuild consonant dropdown
    const consonantDropDown = document.querySelector("#consonantValue");
    consonantDropDown.innerHTML = "";

    const consonants = "bcdfghjklmnpqrstvwxyz".toUpperCase();
    
    for (const consonant of consonants) {
        const option2 = document.createElement("option");
        option2.setAttribute("id","letter"+consonant);
        option2.setAttribute("value",consonant);
        option2.innerText = consonant;
        consonantDropDown.append(option2);
    }
    
} //endOfRebuild function


   
function init(indexWordInput) {
    const formDiv = document.querySelector("#form");
    formDiv.style.display = "none";
    const appDiv = document.querySelector("#app");
    appDiv.style.display = "block";     

    makeSquares();
      
    // let randomNumber = Math.floor(Math.random()*originalWord.length);
    wordWOF = new Word(originalWord[indexWordInput].title, originalWord[indexWordInput].category);
    console.log(originalWord[indexWordInput].title);
    originalWord.splice(indexWordInput, 1);

    wordWOF.getUniqueLetters();
    //wordWOF.getStartWord();
    wordWOF.arrangeLetters();
    wordWOF.setCategory();            
}

//wheel characteristics
const symbolSegments = [
    300,
    250,
    750,
    "bankrupt",
    300,
    250,
    600,
    400,
    150,
    200,
    250,
    400,
    "loseATurn",
    450,
    150,
    200,
    100,
    "freeSpin",
    200,
    300,
    400,
    500,
    100,
    200
];

let segmentSize = 360/symbolSegments.length; //deg per segment of the wheel

function chosenSegment(actualDeg) {
    const winningSegmentNr = Math.ceil(actualDeg / segmentSize);
    resultShow.innerText = symbolSegments[winningSegmentNr-1];
    return resultShow.innerText;
};

function togglePlayer(playerInput) {

    //socket.removeAllListeners("togglePlayer");    
    if (playerInput.isTurn) {
        socket.emit("togglePlayer");
    }

    socket.removeAllListeners("toggleFromServer");
    socket.on("toggleFromServer", () => {
        console.log("here: "+playerInput.isTurn);
        if (playerInput.isTurn) {
            playerInput.isTurn = false;
        } else {
            playerInput.isTurn = true;
        }
        playGame(playerInput);
    });
         
}

let timer = 0;
let timerInterval;
let deg = 0; 

function updateScore(playerInput) {
    const scoreBoard1 = document.querySelector(".p1-score");
    const healthBoard1 = document.querySelector(".p1-health");
    const accScoreBoard1 = document.querySelector(".p1-accScore");
    const scoreBoard2 = document.querySelector(".p2-score");
    const healthBoard2 = document.querySelector(".p2-health");
    const accScoreBoard2 = document.querySelector(".p2-accScore");
    
    if (playerInput.isTurn) {
        socket.removeAllListeners("updateScore");
        socket.emit("updateScore", {
            health: playerInput.health, 
            score: playerInput.score, 
            accScore: playerInput.accScore}
        );
    }

    socket.removeAllListeners("otherPlayerScore");
    socket.on("otherPlayerScore", (scores) => {
        
        console.log(playerInput.name);

        if (playerInput.isTurn) {
            healthBoard1.innerText = scores.health;
            scoreBoard1.innerText = scores.score;
            accScoreBoard1.innerText = scores.accScore;
        } else {
            healthBoard2.innerText = scores.health;
            scoreBoard2.innerText = scores.score;
            accScoreBoard2.innerText = scores.accScore;
        }
    });
}

function startButtonFnc() {
    
    resultShow.innerText = "-";
    letterResults.innerText = "-";
    timerInterval = setInterval( () => {
        timer = timer + 0.5;
        console.log(timer);
    }, 400);
}

function startButtonPointerUp() {
    //console.log(event.type);
    // We need to disable the button while the wheel is spinning
    startButton.style.pointerEvents = "none";
    let timerSpin1 = timer*1000+Math.floor(Math.random()*700)+360;
    socket.removeAllListeners("spinWheelTimer");    
    socket.emit("spinWheelTimer", timerSpin1);          
}

function consonantClick() {        
    const letterInput1 = document.querySelector("#consonantValue").value;
    socket.removeAllListeners("client");            
    socket.emit("client",letterInput1);
    console.log("emitted from button");                            
}

function isVowel (letterInput) {      
    const vowels = ["A","E","I","O","U"];
    const isVowel = vowels.some((vowel) => {
        return vowel === letterInput;
    });    
    return isVowel;
}

const vowelButtonClick = function() {

    const vowelInput = document.querySelector('#vowelValue').value;
    let scoreBoardValue;            
    
    if (player1.isTurn) {
        scoreBoardValue = parseInt(scoreBoard1.innerText);
    } else {
        scoreBoardValue = parseInt(scoreBoard2.innerText);
    }

    if (scoreBoardValue >= 250) {
        player1.score = player1.score - 250;
        socket.removeAllListeners("vowel");
        socket.emit("vowel",vowelInput);             
        updateScore(player1);
                             
    } else {
        letterResults.innerText = "Can't buy vowel"
    }         

    //socket.removeAllListeners("vowelServer");
    

}

//spinWheel function
function spinWheel(spinDeg) {
    // Calculate a new rotation which depends on how long one presses the button plus some randomness
    deg = Math.floor(spinDeg);
    // Set the transition on the wheel
    wheel.style.transition = 'all 1s ease-out';
    // Rotate the wheel
    wheel.style.transform = `rotate(${deg}deg)`;
    // Apply the blur, so that it looks cool while the wheel is spinning
    wheel.classList.add('blur');    
    clearInterval(timerInterval);
    timer=0;
}

function transitionEndFnc(playerTransition) {
    // Remove blur
    wheel.classList.remove('blur');
    // Enable button when spin is over
    startButton.style.pointerEvents = 'auto';
    // Need to set transition to none as we want to rotate instantly
    wheel.style.transition = 'none';
    // Calculate degree on a 360 degree basis to get the real rotation
    // Important because we want to start the next spin from that one
    // Use modulus to get the rest value from 360
    const actualDeg = deg % 360;
    // Set the real rotation instantly without animation
    wheel.style.transform = `rotate(${actualDeg}deg)`;
    //Calculate and display the chosen segment;
    const tempResult = chosenSegment(actualDeg);
    
    
    if (tempResult == "bankrupt") {
        //console.log(tempResult);
        if (playerTransition.isTurn) {
            playerTransition.score = 0;
            console.log("bankrupt called!");
            updateScore(playerTransition);  
            togglePlayer(playerTransition);
        } else {
            togglePlayer(playerTransition);
        }
        
        

    } else if (tempResult == "freeSpin") {
        if (playerTransition.isTurn) {
            playerTransition.health++;
            letterResults.innerText = "Health Gained!";
            updateScore(playerTransition);  
        }                
          

    } else if (tempResult == "loseATurn") {
            togglePlayer(playerTransition);
    
    } else {
        if (playerTransition.isTurn) {
            startButton.style.display = "none";      
            userInput.style.display = "flex";
        } else {
            userInput.style.display = "none";                    
        }
    }    
}

function spinagainClick() {
    spinAgainDiv.style.display = "none";
    consonantDiv.style.display = "block";
    userInput.style.display = "none";
    startButton.style.display = "flex";     
}



function doSetTimeOut(i, lettersFoundArg, letterInputArg) {
    const mySound = document.querySelector("audio");

    setTimeout( () => {
        
        mySound.play();
        lettersFoundArg[i].style["background-color"] = "white";
        lettersFoundArg[i].style.transition = "background-color 1s ease";
        lettersFoundArg[i].innerText = letterInputArg;
    }, i*1500);
}

//What to do if the guessed letter (vowels or consonants) is found
function showLettersFound(playerInput, letterInput){
    console.log("I am called!");

    const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
    console.log(letterInput);
    const letterDropDown = document.querySelector("#letter"+letterInput);
    console.log("letterdropdown: "+letterDropDown);
    letterDropDown.remove();

    letterResults.innerText = lettersFound.length + " " + letterInput + " found";
    for (let i=0; i<lettersFound.length; i++) { 
        doSetTimeOut(i, lettersFound, letterInput);
    }
  

    if (isVowel(letterInput) === false) {
        playerInput.score = playerInput.score + parseInt(resultShow.innerText)*lettersFound.length;
        updateScore(playerInput);  
    }
        
    wordWOF.uniqueCharCount--;

    //if all the letters have been guessed
    if (wordWOF.uniqueCharCount === 1) {
        letterResults.innerText = "CONGRATS";
        resultShow.innerText = "CONGRATS";   
        userInput.style.display = "none";
        anotherRoundDiv.style.display = "flex";
            // solveInputField.value = "";
    }

};


//What to do if the guessed letter (vowels or consonants) is not found
function noLettersFound(playerNoLetters,letterInput) {
    //const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
    const letterDropDown = document.querySelector("#letter"+letterInput);        
    letterResults.innerText = "No "+letterInput+" found!";  
    
    letterDropDown.remove();
    userInput.style.display = "none";    
    spinAgainDiv.style.display = "none";
    consonantDiv.style.display = "block";
    togglePlayer(playerNoLetters);                
       
}



////==========////
//==========

function playGame(playerArg) {
   
    console.log(playerArg)        

    if (playerArg.isTurn) {
        startButton.style.display = "block";        
    } else {
        startButton.style.display = "none";        
    }

    consonantDiv.style.display = "block";
    spinAgainDiv.style.display = "none";    
    
    //Animation for the spinning of the wheel. 
    //pointerdown and pointerup is there so that we can calculate the number of seconds the button is stayed press
    startButton.removeEventListener("pointerdown", startButtonFnc);    
    startButton.addEventListener("pointerdown", startButtonFnc);    

    startButton.removeEventListener("pointerup", startButtonPointerUp);
    startButton.addEventListener("pointerup", startButtonPointerUp);

    socket.removeAllListeners("timerReturn");
    socket.on("timerReturn", (timerReturn) => {
        spinWheel(timerReturn);

        //what should the programme do after the wheel has finished its animation
        //wheel.removeEventListener('transitionend', transitionEndFnc(playerArg));
        wheel.addEventListener('transitionend', transitionEndFnc(playerArg));
        
    });      

    
    consonantButton.removeEventListener('click',consonantClick);
    consonantButton.addEventListener('click', consonantClick);
    
    socket.removeAllListeners("letterServer");
    socket.on("letterServer", (letterValue1) => {
        console.log("after socket on: "+letterValue1);
        console.log(wordWOF.letters.indexOf(letterValue1));
        if (wordWOF.letters.indexOf(letterValue1) > -1) {                
            showLettersFound(playerArg, letterValue1);            
            consonantDiv.style.display = "none";
            spinAgainDiv.style.display = "flex";
        } else {
            console.log("after socket on: no letters found");
            noLettersFound(playerArg,letterValue1);                      
        }
    });
    
    
    vowelButton.removeEventListener('click', vowelButtonClick);    
    vowelButton.addEventListener('click', vowelButtonClick);

    socket.removeAllListeners("vowelServer");
    socket.on("vowelServer",(vowelValue) => {
        console.log("vowelserver is called!");
        if (wordWOF.letters.indexOf(vowelValue) > -1) {
            showLettersFound(playerArg, vowelValue);                                    
        } else {
            noLettersFound(playerArg,vowelValue);            
        }
        let vowelDropDown = document.querySelector('#vowelValue').childElementCount;
        //console.log(vowelDropDown);
        if (vowelDropDown < 1) {
            vowelDiv.style.visibility = "hidden";
        }
    });   
        
    spinagainButton.removeEventListener('click', spinagainClick);
    spinagainButton.addEventListener('click', spinagainClick);
    

    
        solveButton.addEventListener('click', () => {
            let solveInputField = document.querySelector("#solveValue");
            const solveInput = solveInputField.value.toUpperCase();
            if (solveInput === wordWOF.letters) {
                playerArg.updateAccScore();
                accScoreBoard.innerText = playerArg.accScore;
                for (let i=0; i<solveInput.length; i++) {
                    if (solveInput[i] !== " ") {                    
                        const lettersFound = document.querySelectorAll("[letter ="+solveInput[i]+"]");
                        for (const letter of lettersFound) {
                            letter.innerText = solveInput[i];
                            letter.style["background-color"] = "white";                
                        }
                    }
                }
    
                letterResults.innerText = "CONGRATS";
                resultShow.innerText = "CONGRATS";   
                userInput.style.display = "none";
                anotherRoundDiv.style.display = "flex";
                solveInputField.value = "";
    
            } else {
                letterResults.innerText = "Wrong solve!";
                togglePlayer(playerArg);
                solveInputField.value = "";
    
                if (playerArg.health > 0) {
                    userInput.style.display = "none";
                    startButton.style.display = "flex";
                    spinAgainDiv.style.display = "none";
                    consonantDiv.style.display = "block";
                    scoreBoard.innerText = playerArg.score;
                }
            }                       
    
        }); //end of solve button

     
    
    const playAgainGame = (playerArg) => {
        const squares = document.querySelectorAll(".square");
        
        for (const square of squares) {
            square.innerText = "";
            square.style["background-color"] = "#ffd900";
            square.setAttribute("letter","");
        }

        randomNumber = Math.floor(Math.random()*originalWord.length);
        wordWOF = new Word(originalWord[randomNumber].title, originalWord[randomNumber].category);
        originalWord.splice(randomNumber, 1);
        wordWOF.arrangeLetters();
        wordWOF.setCategory();

        anotherRoundDiv.style.display = "none";
        startButton.style.display = "flex";
        userInput.style.display = "none";
        spinAgainDiv.style.display = "none";
        consonantDiv.style.display = "block";
        vowelDiv.style.visibility = "visible";
        resultShow.innerText = "";
        letterResults.innerText = "";

        playerArg.score = 0;        
        playerArg.health = 0;
        updateScore(playerArg);

        scoreBoard.innerText = playerArg.score;
        healthBoard.innerText = playerArg.health;
        rebuildDropDown();
    }

    playAgainButton.addEventListener('click', playAgainGame); //end of play again button

}