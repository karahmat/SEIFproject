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
    constructor(name,isTurn) {
        this.name = name;
        this.score = 0;
        this.playersTurn = false;
        this.health = 3;
        this.accScore = 0;
        this.isTurn = isTurn;
    }

    updateAccScore() {
        this.accScore = this.accScore + this.score;
    }

    
}


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

//DOM elements
const formDiv = document.querySelector("#form");
const appDiv = document.querySelector("#app");
const wheel = document.querySelector(".wheel");
const startButton = document.querySelector("#spinButton-container");
const resultShow = document.querySelector(".results");
const userInput = document.querySelector("#user-input");
const vowelButton = document.querySelector("#vowelButton");
const solveButton = document.querySelector("#solveButton");
const consonantButton = document.querySelector("#consonantButton");
const letterResults = document.querySelector(".letter-results");
const scoreBoard = document.querySelector(".p-score");
const healthBoard = document.querySelector(".p-health");
const accScoreBoard = document.querySelector(".p-accScore");
const consonantDiv = document.querySelector(".consonant");
const vowelDiv = document.querySelector(".vowel");
const spinAgainDiv = document.querySelector(".spinAgain");
const spinagainButton = document.querySelector("#spinagainButton");
const anotherRoundDiv = document.querySelector("#anotherRoundDiv");
const playAgainButton = document.querySelector("#playAgainButton");
const mySound = document.querySelector("audio");

    
function init(name,isTurn, indexWordInput) {
    formDiv.style.display = "none";
    const appDiv = document.querySelector("#app");
    appDiv.style.display = "block";
    
    if (isTurn) {
        startButton.style.display = "block";
    } else {
        startButton.style.display = "none";
    }

    makeSquares();
    const player1 = new Player(name,isTurn);    
    let randomNumber = Math.floor(Math.random()*originalWord.length);
    let wordWOF = new Word(originalWord[indexWordInput].title, originalWord[indexWordInput].category);
    console.log(originalWord[indexWordInput].title);
    originalWord.splice(indexWordInput, 1);

    wordWOF.getUniqueLetters();
    //wordWOF.getStartWord();
    wordWOF.arrangeLetters();
    wordWOF.setCategory();    

    let timer = 0;
    let timerInterval;
    let deg = 0;
    
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

    const chosenSegment = (actualDeg) => {
        const winningSegmentNr = Math.ceil(actualDeg / segmentSize);
        resultShow.innerText = symbolSegments[winningSegmentNr-1];
        return resultShow.innerText;
    };

    const isVowel = (letterInput) => {
        let isVowel = false;
        const vowels = ["A","E","I","O","U"];
        for (const vowel of vowels) {
            if (letterInput === vowel) {
                isVowel = true;
            }
        }
        
        return isVowel;
    }    
      
    function doSetTimeOut(i, lettersFoundArg, letterInputArg) {
        setTimeout( () => {
            
            mySound.play();
            lettersFoundArg[i].style["background-color"] = "white";
            lettersFoundArg[i].style.transition = "background-color 1s ease";
            lettersFoundArg[i].innerText = letterInputArg;
        }, i*1500);
    }

    //What to do if the guessed letter (vowels or consonants) is found
    const showLettersFound = (letterInput) => {
        const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
        const letterDropDown = document.querySelector("#letter"+letterInput);
        letterResults.innerText = lettersFound.length + " " + letterInput + " found";
        for (let i=0; i<lettersFound.length; i++) { 
                doSetTimeOut(i, lettersFound, letterInput);
            }

        letterDropDown.remove();

        if (isVowel(letterInput) === false) {
        player1.score = player1.score + parseInt(resultShow.innerText)*lettersFound.length;
        }

        scoreBoard.innerText = player1.score;
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

    //Reduce health function needed when no words found, bankrupt, lose a Turn
    const reduceHealth = () => {
        player1.health--;
        healthBoard.innerText = player1.health;
        if (player1.health <=0) {
            userInput.style.display = "none";
            startButton.style.display = "none";   
            anotherRoundDiv.style.display = "flex";
        }
    }

    //What to do if the guessed letter (vowels or consonants) is not found
    const noLettersFound = (letterInput) => {
        //const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
        const letterDropDown = document.querySelector("#letter"+letterInput);        
        letterResults.innerText = "No "+letterInput+" found!";
        reduceHealth();

        if (player1.health > 0) {
            letterDropDown.remove();
            userInput.style.display = "none";
            startButton.style.display = "flex";
            spinAgainDiv.style.display = "none";
            consonantDiv.style.display = "block";
            scoreBoard.innerText = player1.score;               
        }
    }

    const playAgainGame = () => {
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
        player1.score = 0;
        scoreBoard.innerText = player1.score;
        player1.health = 3;
        healthBoard.innerText = player1.health;
        rebuildDropDown();
    }
   


    //Animation for the spinning of the wheel. 
    //pointerdown and pointerup is there so that we can calculate the number of seconds the button is stayed press
    startButton.addEventListener("pointerdown", (event) => {
        resultShow.innerText = "-";
        letterResults.innerText = "-";
        timerInterval = setInterval( () => {
            timer = timer + 0.5;
            console.log(timer);
        }, 400);
    });

    startButton.addEventListener("pointerup", (event) => {
        //console.log(event.type);
            // We need to disable the button while the wheel is spinning
        startButton.style.pointerEvents = "none";
            // Calculate a new rotation which depends on how long one presses the button plus some randomness
        deg = Math.floor(timer*1000+Math.floor(Math.random()*700)+360);
            // Set the transition on the wheel
        wheel.style.transition = 'all 1s ease-out';
            // Rotate the wheel
        wheel.style.transform = `rotate(${deg}deg)`;
            // Apply the blur, so that it looks cool while the wheel is spinning
        wheel.classList.add('blur');
        clearInterval(timerInterval);
        timer=0;
    });
  
    //what should the programme do after the wheel has finished its animation
    wheel.addEventListener('transitionend', () => {
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
        reduceHealth();
        player1.score = 0;
        scoreBoard.innerText = player1.score;   

      } else if (tempResult == "freeSpin") {
        player1.health++;
        healthBoard.innerText = player1.health;
        letterResults.innerText = "Health Gained!";  

      } else if (tempResult == "loseATurn") {
        reduceHealth();
        letterResults.innerText = "Health Lost!";  

      } else {
        startButton.style.display = "none";      
        userInput.style.display = "flex";
      }
      
    });

    consonantButton.addEventListener('click', () => {
        let consonantInput = document.querySelector("#consonantValue").value;
        consonantInput = consonantInput.toUpperCase();
        if (wordWOF.letters.indexOf(consonantInput) > -1) {
            showLettersFound(consonantInput);            
            consonantDiv.style.display = "none";
            spinAgainDiv.style.display = "flex";
        } else {
            noLettersFound(consonantInput);            
        }

    });

    vowelButton.addEventListener('click', () => {
        let vowelInput = document.querySelector('#vowelValue').value;
        vowelInput = vowelInput.toUpperCase();
        if (player1.score >= 250) {
            player1.score = player1.score - 250;
            if (wordWOF.letters.indexOf(vowelInput) > -1) {
                showLettersFound(vowelInput);                                      
            } else {
                noLettersFound(vowelInput);                              
            }
            let vowelDropDown = document.querySelector('#vowelValue').childElementCount;
            //console.log(vowelDropDown);
            if (vowelDropDown < 1) {
                vowelDiv.style.visibility = "hidden";
            }

        } else {
            letterResults.innerText = "Can't buy vowel"
        }

    });

    spinagainButton.addEventListener('click', () => {
        spinAgainDiv.style.display = "none";
        consonantDiv.style.display = "block";
        userInput.style.display = "none";
        startButton.style.display = "flex";     
    });

    solveButton.addEventListener('click', () => {
        let solveInputField = document.querySelector("#solveValue");
        const solveInput = solveInputField.value.toUpperCase();
        if (solveInput === wordWOF.letters) {
            player1.updateAccScore();
            accScoreBoard.innerText = player1.accScore;
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
            reduceHealth();
            solveInputField.value = "";

            if (player1.health > 0) {
                userInput.style.display = "none";
                startButton.style.display = "flex";
                spinAgainDiv.style.display = "none";
                consonantDiv.style.display = "block";
                scoreBoard.innerText = player1.score;
            }
        }                       

    }); //end of solve button

    playAgainButton.addEventListener('click', playAgainGame); //end of play again button

}