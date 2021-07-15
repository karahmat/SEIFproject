// const originalWord = [
//     {movie: "The Terminator", category: "Suspense"},
//     {movie: "The Avengers", category: "Action"}, 
//     {movie: "The New Avatar Series", category: "Fantasy"},
//     {movie: "Buffy the Vampire Slayer", category: "Comedy"},
//     {movie: "Borat Part Two", category: "Comedy"}
// ];
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
    constructor() {
        this.name = "Player1";
        this.score = 0;
        this.playersTurn = false;
        this.health = 3;
        this.accScore = 0;
    }

    updateAccScore() {
        this.accScore = this.accScore + this.score;
    }
    
    //Reduce health function needed when no words found, bankrupt, lose a Turn
    reduceHealth() {
        this.health--;
        healthBoard.innerText = this.health;
        if (this.health <=0) {
            userInput.style.display = "none";
            startButton.style.display = "none";   
            anotherRoundDiv.style.display = "flex";
        }
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

        this.timer = 0;
        this.timerInterval = 0;
        this.deg = 0;
        this.chosenSlice = "";
    }

    pressButton() {
        const resultShow = document.querySelector(".results");
        const letterResults = document.querySelector(".letter-results");
        resultShow.innerText = "-";
        letterResults.innerText = "-";
        this.timerInterval = setInterval( () => {
            this.timer = this.timer + 0.5;
            console.log(this.timer);
        }, 400);
    }

    liftButton() {        
        this.deg = Math.floor(this.timer*1000+Math.floor(Math.random()*700)+360);
            // Set the transition on the wheel
        wheel.style.transition = 'all 1s ease-out';
            // Rotate the wheel
        wheel.style.transform = `rotate(${this.deg}deg)`;
            // Apply the blur, so that it looks cool while the wheel is spinning
        wheel.classList.add('blur');
        clearInterval(this.timerInterval);
        this.timer=0;        
    }

}

//animate the navigation bar
const toggleButton = document.querySelector(".navbar-toggle");
const navBarLinks = document.querySelectorAll(".navbar-links");
toggleButton.addEventListener("click", () => {
    for (let i=0; i<navBarLinks.length; i++) {
        navBarLinks[i].classList.toggle("active");
    }
});


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

function transitionEndFnc() {
    
    // Remove blur
    wheel.classList.remove('blur');
    // Enable button when spin is over
    startButton.style.pointerEvents = 'auto';
    // Need to set transition to none as we want to rotate instantly
    wheel.style.transition = 'none';
    // Calculate degree on a 360 degree basis to get the real rotation
    // Important because we want to start the next spin from that one
    // Use modulus to get the rest value from 360
    const actualDeg = wheelObj.deg % 360;
    // Set the real rotation instantly without animation
    wheel.style.transform = `rotate(${actualDeg}deg)`;
    //Calculate and display the chosen segment;
    const segmentSize = 360/wheelObj.symbolSegments.length; //deg per segment of the wheel
    const winningSegmentNr = Math.ceil(actualDeg/segmentSize);
    wheelObj.chosenSlice = wheelObj.symbolSegments[winningSegmentNr-1];
    resultShow.innerText = wheelObj.chosenSlice;
        
    if (wheelObj.chosenSlice == "bankrupt") {
        
        player1.reduceHealth();
        player1.score = 0;
        scoreBoard.innerText = player1.score;   

    } else if (wheelObj.chosenSlice == "freeSpin") {
        player1.health++;
        healthBoard.innerText = player1.health;
        letterResults.innerText = "Health Gained!";  

    } else if (wheelObj.chosenSlice == "loseATurn") {
        player1.reduceHealth();
        letterResults.innerText = "Health Lost!";  

    } else {
        startButton.style.display = "none";      
        userInput.style.display = "flex";
    }

}

makeSquares();

const player1 = new Player("Azman");
const wheelObj = new Wheel();

let randomNumber = Math.floor(Math.random()*originalWord.length);

let wordWOF = new Word(originalWord[randomNumber].title, originalWord[randomNumber].category);
//console.log(originalWord[randomNumber].title);

originalWord.splice(randomNumber, 1);

wordWOF.getUniqueLetters();
//wordWOF.getStartWord();
wordWOF.arrangeLetters();
wordWOF.setCategory();
