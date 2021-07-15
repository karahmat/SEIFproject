//add socket
const socket = io();
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
        if (this.uniqueChar.includes(" ")) {
            this.uniqueCharCount--;
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
    
    updateScore() {
        const scoreBoard1 = document.querySelector(".p1-score");
        const healthBoard1 = document.querySelector(".p1-health");
        const accScoreBoard1 = document.querySelector(".p1-accScore");
        const scoreBoard2 = document.querySelector(".p2-score");
        const healthBoard2 = document.querySelector(".p2-health");
        const accScoreBoard2 = document.querySelector(".p2-accScore");
        
        if (this.isTurn) {
            //socket.removeAllListeners("updateScore");
            socket.emit("updateScore", {
                health: this.health, 
                score: this.score, 
                accScore: this.accScore}
            );
        }

        socket.removeAllListeners("otherPlayerScore");
        socket.on("otherPlayerScore", (scores) => {      
            console.log("socket on OtherPlayerScores: "+scores.score);
            if (this.isTurn) {
                healthBoard1.innerText = scores.health;
                scoreBoard1.innerText = scores.score;
                accScoreBoard1.innerText = scores.accScore;
            } else {
                healthBoard2.innerText = scores.health;
                scoreBoard2.innerText = scores.score;
                accScoreBoard2.innerText = scores.accScore;
            }
        });

    } //end of updateScore

    togglePlayer() {
        const playerDiv = document.querySelector("#player");

        //socket.removeAllListeners("togglePlayer");    
        if (this.isTurn) {
            socket.emit("togglePlayer");
        }
    
        socket.removeAllListeners("toggleFromServer");
        socket.on("toggleFromServer", () => {
            console.log("socketOn - ToggleFromServer: "+this.isTurn);
            if (this.isTurn) {
                this.isTurn = false;
                playerDiv.innerText = "OPP'S TURN";
            } else {
                this.isTurn = true;
                playerDiv.innerText = "MY TURN";
            }
            playGame(this);
        });
             
    }
    
}

class Wheel {
    constructor() {        
        this.symbolSegments = [
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
        
        this.timerInterval = 0;
        this.timer = 0;
        this.deg = 0;
        this.timerSpin1 = 0;
        this.spinDeg = 0;
        this.actualDeg = 0;        
        this.chosenSlice = "";                  

    } //end of constructor
 

    pressButton() {
        const resultShow = document.querySelector(".results");
        const letterResults = document.querySelector(".letter-results");
        resultShow.innerText = "-";
        letterResults.innerText = "-";        
        this.timerInterval = setInterval( () => {
        this.timer = this.timer + 0.5;}, 400);
        console.log("timer: "+ this.timerInterval);
    }

    liftButton() {
        this.timerSpin1 = this.timer*1000+Math.floor(Math.random()*700)+360;
    }

    spinWheel() {
              
        // Calculate a new rotation which depends on how long one presses the button plus some randomness
        this.deg = Math.floor(this.spinDeg);
        // Set the transition on the wheel
        wheel.style.transition = 'all 2s ease-out';
        // Rotate the wheel
        wheel.style.transform = `rotate(${this.deg}deg)`;
        // Apply the blur, so that it looks cool while the wheel is spinning
        wheel.classList.add('blur');          
        clearInterval(this.timerInterval);
        this.timer=0;
        //what should the programme do after the wheel has finished its animation                
    }

    transitionEnd() {
        
        const startButton = document.querySelector("#spinButton-container");
        const letterResults = document.querySelector(".letter-results");        
        const userInput = document.querySelector("#user-input");
        const resultShow = document.querySelector(".results");

        //blur the wheel
        wheel.classList.remove('blur');
        // Enable button when spin is over
        startButton.style.pointerEvents = 'auto';
        // Need to set transition to none as we want to rotate instantly
        wheel.style.transition = 'none';
        // Calculate degree on a 360 degree basis to get the real rotation
        // Important because we want to start the next spin from that one
        // Use modulus to get the rest value from 360
        const actualDeg = this.deg % 360;
        // Set the real rotation instantly without animation
        wheel.style.transform = `rotate(${actualDeg}deg)`;
        //Calculate and display the chosen segment;
        console.log(this.symbolSegments);
        const segmentSize = 360/(this.symbolSegments.length); //deg per segment of the wheel
        const winningSegmentNr = Math.ceil(actualDeg / segmentSize);
        this.chosenSlice = this.symbolSegments[winningSegmentNr-1];        
        resultShow.innerText = this.chosenSlice;
        

        if (this.chosenSlice == "bankrupt") {
            //console.log(tempResult);
            if (player1.isTurn) {
                player1.score = 0;
                //console.log("bankrupt called!");
                player1.updateScore();  
                player1.togglePlayer();
            } else {
                player1.togglePlayer();
            }
            
            
    
        } else if (this.chosenSlice == "freeSpin") {
            if (player1.isTurn) {
                player1.health++;
                letterResults.innerText = "Health Gained!";
                player1.updateScore();  
            }                
            
    
        } else if (this.chosenSlice == "loseATurn") {
                player1.togglePlayer();
        
        } else {
            if (player1.isTurn) {
                startButton.style.display = "none";      
                userInput.style.display = "flex";
            } else {
                userInput.style.display = "none";                    
            }
        }    
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
const playerDiv = document.querySelector("#player");
const solveInputField = document.querySelector("#solveValue");
let wordWOF;
let player1;
let wheelObj;

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
    wheelObj = new Wheel();  
    // let randomNumber = Math.floor(Math.random()*originalWord.length);
    wordWOF = new Word(originalWord[indexWordInput].title, originalWord[indexWordInput].category);
    console.log(originalWord[indexWordInput].title);
    originalWord.splice(indexWordInput, 1);

    wordWOF.getUniqueLetters();
    //wordWOF.getStartWord();
    wordWOF.arrangeLetters();
    wordWOF.setCategory();            
}

function startButtonFnc() { 
    wheelObj.pressButton();   
}

function startButtonPointerUp() {
    //console.log(event.type);
    // We need to disable the button while the wheel is spinning
    startButton.style.pointerEvents = "none";
    wheelObj.liftButton();    
    socket.removeAllListeners("spinWheelTimer");    
    socket.emit("spinWheelTimer", wheelObj.timerSpin1);          
}

function transitionEndFnc() {
    wheelObj.transitionEnd();
}

function consonantClick() {        
    const letterInput1 = document.querySelector("#consonantValue").value;
    //socket.removeAllListeners("client");            
    socket.emit("consonant",letterInput1);    
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
        if (scoreBoardValue >= 250) {
            player1.score = player1.score - 250;
            socket.removeAllListeners("vowel");
            socket.emit("vowel",vowelInput);             
            player1.updateScore();
                                 
        } else {
            letterResults.innerText = "Can't buy vowel"
        }

    } else {
        scoreBoardValue = parseInt(scoreBoard2.innerText);
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
        if (playerInput.isTurn) {
            playerInput.score = playerInput.score + parseInt(resultShow.innerText)*lettersFound.length;
        }

        playerInput.updateScore();  
    }
        
    wordWOF.uniqueCharCount--;

    //if all the letters have been guessed
    if (wordWOF.uniqueCharCount === 0) {
        letterResults.innerText = "SOLVED";
        resultShow.innerText = "SOLVED";   
        userInput.style.display = "none";
        if (player1.isTurn) {
            anotherRoundDiv.style.display = "flex";
        }
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
    playerNoLetters.togglePlayer();                
       
}

function solveButtonClick() {      
    socket.emit("solveValue",solveInputField.value.toUpperCase());
}

function playAgainGame() {    
    socket.emit("playAgainRandomNo", originalWord.length);    
}

////==========////
//==========
//==============

function playGame(playerArg) {
   
    console.log(playerArg)        

    if (playerArg.isTurn) {
        startButton.style.display = "flex";        
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

    wheel.removeEventListener('transitionend', transitionEndFnc);
    wheel.addEventListener('transitionend', transitionEndFnc);

    socket.removeAllListeners("timerReturn");
    socket.on("timerReturn", (timerReturn) => {
        wheelObj.spinDeg = timerReturn;
        wheelObj.spinWheel();      
        
    });      

    
    consonantButton.removeEventListener('click',consonantClick);
    consonantButton.addEventListener('click', consonantClick);
    
    socket.removeAllListeners("consonantServer");
    socket.on("consonantServer", (letterValue1) => {
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
    
    solveButton.removeEventListener('click', solveButtonClick); //end of solve button
    solveButton.addEventListener('click', solveButtonClick); //end of solve button
    
    socket.removeAllListeners("solveInputFromServer");
    socket.on("solveInputFromServer", (solveInput) => {
        console.log("solveInputFromServer returns "+solveInput);
        if (solveInput === wordWOF.letters) {

            if (playerArg.isTurn) {
                playerArg.updateAccScore();                                   
            }
            playerArg.updateScore();

            for (let i=0; i<solveInput.length; i++) {
                if (solveInput[i] !== " ") {                    
                    const lettersFound = document.querySelectorAll("[letter ="+solveInput[i]+"]");
                    for (const letter of lettersFound) {
                        letter.innerText = solveInput[i];
                        letter.style["background-color"] = "white";                
                    }
                }
            }

            letterResults.innerText = "SOLVED";
            resultShow.innerText = "SOLVED";   
            userInput.style.display = "none";            
            solveInputField.value = "";
            if (playerArg.isTurn) {
                anotherRoundDiv.style.display = "flex";
            }            

        } else {
            letterResults.innerText = "Wrong solve!";
            playerArg.togglePlayer();
            solveInputField.value = "";
    
            userInput.style.display = "none";
            startButton.style.display = "flex";
            spinAgainDiv.style.display = "none";
            consonantDiv.style.display = "block";            
        }                       

    });

    playAgainButton.removeEventListener('click', playAgainGame); //end of play again button
    playAgainButton.addEventListener('click', playAgainGame); //end of play again button

    socket.removeAllListeners("playAgainIndexWord");
    socket.on("playAgainIndexWord", (indexWord) => {
        console.log("playAgainIndexWord is called "+originalWord[indexWord].title);
        const squares = document.querySelectorAll(".square");
    
        for (const square of squares) {
            square.innerText = "";
            square.style["background-color"] = "#ffd900";
            square.setAttribute("letter","");
        }

        letterResults.innerText = "NEW RD";
        resultShow.innerText = "NEW RD";   
        wordWOF = new Word(originalWord[indexWord].title, originalWord[indexWord].category);
        originalWord.splice(indexWord, 1);
        wordWOF.arrangeLetters();
        wordWOF.setCategory();
        wordWOF.getUniqueLetters();

        anotherRoundDiv.style.display = "none";

        if (playerArg.isTurn) {
            startButton.style.display = "flex";
        } else {
            startButton.style.display = "none";
        }

        userInput.style.display = "none";
        spinAgainDiv.style.display = "none";
        consonantDiv.style.display = "block";
        vowelDiv.style.visibility = "visible";        

        playerArg.score = 0;             
        playerArg.health = 0;
        playerArg.updateScore();
        
        if (playerArg.isTurn){
            scoreBoard2.innerText = 0;
            healthBoard2.innerText = 0;
        } else {
            scoreBoard1.innerText = 0;
            healthBoard1.innerText = 0;
        }
        
        rebuildDropDown();

    });
}