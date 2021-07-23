(function() {    

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
            
            pingSound.play();
            lettersFoundArg[i].style["background-color"] = "white";
            lettersFoundArg[i].style.transition = "background-color 1s ease";
            lettersFoundArg[i].innerText = letterInputArg;

        }, i*1500);
    }

    //What to do if the guessed letter (vowels or consonants) is found
    function showLettersFound(letterInput){

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

    
    //What to do if the guessed letter (vowels or consonants) is not found
    function noLettersFound(letterInput) {
        //const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
        wrongSound.play();
        const letterDropDown = document.querySelector("#letter"+letterInput);        
        letterResults.innerText = "No "+letterInput+" found!";
        player1.reduceHealth();

        if (player1.health > 0) {
            letterDropDown.remove();
            userInput.style.display = "none";
            startButton.style.display = "flex";
            spinAgainDiv.style.display = "none";
            consonantDiv.style.display = "block";
            scoreBoard.innerText = player1.score;               
        }

    }

    function playAgainGame(){
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
        wheelObj.pressButton();        
    });

    startButton.addEventListener("pointerup", (event) => {        
        
        // We need to disable the button while the wheel is spinning
        startButton.style.pointerEvents = "none";
        // Calculate a new rotation which depends on how long one presses the button plus some randomness
        wheelObj.liftButton();
    });
    
    
     //what should the programme do after the wheel has finished its animation
     wheel.removeEventListener('transitionend',transitionEndFnc);
     wheel.addEventListener('transitionend', transitionEndFnc);
   

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
            wrongSound.play();
            letterResults.innerText = "Wrong solve!";
            player1.reduceHealth();
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

   

  })();