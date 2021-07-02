class Word {
    constructor(letters) {
        this.letters = letters.toUpperCase();
        this.uniqueChar = []; //initialise array to store all my unique characters
        this.charIndex = {};
        this.startWord = [];
        //this.arrIndexLetters = arrIndexLetters;        
    }

    getUniqueLetters() {
        const arrStrings = this.letters.split("");
        //let uniqueChar = []; 
  
        for (let i=0; i<arrStrings.length; i++) {
          if (this.uniqueChar.indexOf(arrStrings[i]) == -1) {
            this.uniqueChar.push(arrStrings[i]);
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

    // getStartWord() {
    //     this.startWord = this.letters;

    //     for (let i=0; i<this.uniqueChar.length; i++) {
    //         if (this.uniqueChar[i] !== " ") {
    //             this.startWord = this.startWord.replaceAll(this.uniqueChar[i],"_");
    //         } 
    //     }
    //     //this.startWord = startWord.split("").join(".");
    // }

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
            console.log(displayObject["row"+i]);
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


}

class Player {
    constructor() {
        this.name = "Player1";
        this.score = 0;
        this.playersTurn = false;
        this.health = 5;
        this.accScore = 0;
    }

    updateAccScore() {
        this.accScore = this.accScore + this.score;
    }

    reduceHealth() {
        this.health--;
    }

}

function makeSquares() {
    const noRows = 5;
    const noBlocksPerRow = 13;
    let newRow;
    
    for (let i=1; i<=noRows; i++) {
        newRow = document.createElement("div");
        newRow.setAttribute("id", ("row"+i));
        newRow.style.display = "flex";
        document.querySelector('#words-container').append(newRow);
        
        for (let j=1; j<=noBlocksPerRow; j++) {
        const square = document.createElement('div');
        square.className = "square";           
        document.querySelector("#row"+i).append(square);
        }
    }
}

makeSquares();

const originalWord = "The Phantom Of The Opera And The Giant Beaver";

const player1 = new Player("Azman");

const wordWOF = new Word(originalWord);
console.log(wordWOF.letters);
wordWOF.getUniqueLetters();
//wordWOF.getStartWord();
wordWOF.arrangeLetters();

