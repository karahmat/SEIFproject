class Word {
    constructor(letters) {
        this.letters = letters.toUpperCase();
        //this.arrIndexLetters = arrIndexLetters;        
    }

    getUniqueLetters() {
        const arrStrings = this.letters.split("");
        let uniqueChar = []; //initialise array to store all my unique characters
  
        for (let i =0; i<arrStrings.length; i++) {
          if (uniqueChar.indexOf(arrStrings[i]) == -1) {
            uniqueChar.push(arrStrings[i]);
            }
        }
        return uniqueChar;
    }

    getCharIndex() {
        const uniqueChars = this.getUniqueLetters();
        
        let charIndex = {};
        
        for (let i=0; i<uniqueChars.length; i++) {
            let indices = [];
            for (let j=0; j<this.letters.length; j++) {
                if(this.letters[j] == uniqueChars[i]) {
                    indices.push(j);
                }
            }
            charIndex[uniqueChars[i]] = indices;
        }
            
        

        return charIndex;

    }

    getStartWord() {
        const uniqueChar = this.getUniqueLetters();
        let startWord = this.letters;

        for (let i=0; i<uniqueChar.length; i++) {
            if (uniqueChar[i] !== " ") {
                startWord = startWord.replaceAll(uniqueChar[i],"_");
            } 
        }
        //startWord = startWord.split("").join(".");
        return startWord;
    }


}


function makeSquares() {
    for (let i=1; i<=135; i++) {
        const square = document.createElement('div');
        square.setAttribute("squareNo",i);
        square.className = "square";
        square.style.width = "28px";
        square.style.height = "28px";    
        document.querySelector('#words-container').append(square);
    }
}

makeSquares();

// const originalWord = "Wheel of Fortune";
// const wordWOF = new Word(originalWord);
// const charIndex = wordWOF.getCharIndex();


// let uniqueChar = wordWOF.getUniqueLetters();
// uniqueChar.splice(uniqueChar.indexOf(" "),1);

// let wordOnScreen = wordWOF.getStartWord()
// console.log(uniqueChar);
// //console.log(uniqueChar.indexOf("N"));

// console.log(wordWOF.letters);
// console.log(wordWOF.getStartWord());

// let wordBox = document.getElementById("words");
// let results = document.getElementById("results");

// wordBox.innerHTML = wordOnScreen;
// //let count = 3;

// while (uniqueChar.length>0) {
//     let guessLetter = prompt("Pick a Letter in Capital", "");
//     if (uniqueChar.indexOf(guessLetter.toUpperCase()) > -1) {
//         wordOnScreen = wordOnScreen.split("");
//         //console.log(wordOnScreen);
//         for (let i=0; i<charIndex[guessLetter.toUpperCase()].length;i++) {
//             wordOnScreen.splice(charIndex[guessLetter.toUpperCase()][i],1,guessLetter.toUpperCase());        
//         }
//         wordOnScreen = wordOnScreen.join("");
//         wordBox.innerHTML = wordOnScreen;
//         results.innerHTML = "Congratulations!";
//         uniqueChar.splice(uniqueChar.indexOf(guessLetter.toUpperCase()),1);
//         console.log(uniqueChar);

//     } else {
//         results.innerHTML = "There is no "+guessLetter;
//         break;
//     }
// }