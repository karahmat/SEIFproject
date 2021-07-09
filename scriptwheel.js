
(function() {
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
        //console.log("Segment Nr: "+winningSegmentNr);
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

    

    //const mySound = new Sound("images/correct.mp3");

    function doSetTimeOut(i, lettersFoundArg, letterInputArg) {
        setTimeout( () => {
            
            mySound.play();
            lettersFoundArg[i].style["background-color"] = "white";
            lettersFoundArg[i].style.transition = "background-color 1s ease";
            lettersFoundArg[i].innerText = letterInputArg;
        }, i*2000);
    }

    //What to do if the guessed letter (vowels or consonants) is found
    const showLettersFound = (letterInput) => {
        const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
        const letterDropDown = document.querySelector("#letter"+letterInput);
        letterResults.innerText = lettersFound.length + " " + letterInput + " found";
        for (let i=0; i<lettersFound.length; i++) {
                
                doSetTimeOut(i, lettersFound, letterInput);
               
                             
                                                                         
                //letter.style.transition = "color 2s ease 2s";                               
                // letter.style.color = "black" //end status of font color
                
            }

        letterDropDown.remove();
        if (isVowel(letterInput) === false) {
        player1.score = player1.score + parseInt(resultShow.innerText)*lettersFound.length;
        }
        scoreBoard.innerText = player1.score;
    };

    //What to do if the guessed letter (vowels or consonants) is not found
    const noLettersFound = (letterInput) => {
        //const lettersFound = document.querySelectorAll("[letter ="+letterInput+"]");
        const letterDropDown = document.querySelector("#letter"+letterInput);        
        letterResults.innerText = "No "+letterInput+" found!";
        player1.health--;
        healthBoard.innerText = player1.health;
        letterDropDown.remove();
        userInput.style.display = "none";
        startButton.style.display = "block";
        spinAgainDiv.style.display = "none";
        consonantDiv.style.display = "block";
        scoreBoard.innerText = player1.score;
                
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
      console.log("result of wheel: "+tempResult);      
      if (tempResult !== "bankrupt" || tempResult !== "loseATurn" || tempResult !== "freeSpin") {
        //console.log(tempResult);
        startButton.style.display = "none";      
        userInput.style.display = "flex";        
      } else {
        startButton.style.display = "flex";      
        userInput.style.display = "none";
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
            player1.accScore = player1.score;
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
            player1.health--;
            healthBoard.innerText = player1.health;
            userInput.style.display = "none";
            startButton.style.display = "flex";
            spinAgainDiv.style.display = "none";
            consonantDiv.style.display = "block";
            scoreBoard.innerText = player1.score;
        }                       

    }); //end of solve button

    playAgainButton.addEventListener('click', () => {
        const squares = document.querySelectorAll(".square");
        
        for (const square of squares) {
            square.innerText = "";
            square.style["background-color"] = "#ffd900";
            square.setAttribute("letter","");
        }

        randomNumber = Math.floor(Math.random()*originalWord.length);
        wordWOF = new Word(originalWord[randomNumber].movie, originalWord[randomNumber].category);
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
        rebuildDropDown();
    }); //end of play again button

  })();