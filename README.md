# Wheel of Fortune with JS / NodeJS

## Introduction
This my first project for a software engineering course. The objective of the project is to present the front-end web/software-development skills that I  have learned. However, for my multiplayer game, I needed a server. I have thus picked up backend development on my own using NodeJS. 

If you are only interested to play the game, you can go to [my app deployed on Heroku](wofazman.herokuapp.com "Wheel Of Fortune by Azman")

## File Structure

```bash
├── package-lock.json
├── package.json 
├── public       //client side html, css, and js
│   ├── about.html //about page
│   ├── app_refactor.js //game controller js
│   ├── images //images and sounds in game
│   │   ├── WOF-wheel.png
│   │   ├── button.png
│   │   ├── correct.mp3
│   │   ├── menuButton.png
│   │   ├── pointer.png
│   │   ├── spinningWheel2.mp3
│   │   └── wofbonuswheel.png
│   ├── index.html //cover page for game
│   ├── nav_script.js //js script for navigation bar
│   ├── onePlayer.html //cover HTML for 1player game
│   ├── onePlayer_script.js //1-player init js
│   ├── onePlayer_script_words.js //1-player word builder
│   ├── onePlayer_scriptwheel.js //1-player game controller js
│   ├── script_index.js //multiplayer init js
│   ├── script_words.js //multiplayer word builder
│   ├── style.css //css stylesheet for multiplayer and oneplayer game
│   └── teststyle.css
└── server
    └── server.js //server side js
```

## Understanding files for 1-Player game
To understand how the programme is coded, it is best to look at the files for the one-player game first. These are marked with the prefix onePlayer_ in the public directory. 

1. onePlayer.html - the html page

2. onePlayer_script.js - the initialiser of the game elements

3. onePlayer_scriptwheel.js - the game controller. It controls the animation and how the user interface changes, as different buttons are pressed. 

4. script_words.js - this is the words builder. My original intention was to tap on the IMDB API to get a list of movie and TV show titles. However, as the free account for IMDB API sets a limit to how many calls can be made per day, I have hardcoded the word list here. If you want to use an IMDP API or other API for your word list, you could use the following function.

```javascript
const getMovieDatabase = async function (url) {
    try {      
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };

let movieTitles = [];
const url = "PUT YOUR URL LINK HERE";

//as the function is asynchronous, it returns a promise. That's why you have to use .then
getMovieDatabase(url)
.then((data) => {
    
    movieTitles = data.items.filter( (movie) => {
        const removedChars = "123456789:-\'\,\.";
        let canBeUsed = true;
        for (let i=0; i<removedChars.length; i++) {
            if (movie.title.indexOf(removedChars[i])>-1) {
                canBeUsed = false;
            }
    
        }
        return canBeUsed;
    });
    console.log(movieTitles.length);
});
```

### Game controller for 1-Player Game
The most complicated file is the public/onePlayer_script.js. To organise my code, I created three Classes:

1. Player Class - *it contains attributes related to a player, including name, score, total score, health, as well as methods, such as updating of total score.*

2. Wheel  Class - *the attributes include the segments of the wheel, the number of degrees that the wheel has turned and the segment of the wheel that the pointer stops to. The methods are there to spin the wheel, and what happens when the spin button is pressed and then lifted. This will allow the wheel to spin faster, the longer the button is pressed.*

3. Word Class - *the attributes are the word chosen from the list of words object, unique characters of the word, and the number of unique characters. The methods include the letter arranger - a function to arrange the letters on the board*

In onePlayer_scriptwheel.js, you will find all the Event Listeners for the different buttons in the game. 


## Understanding the multiplayer game codes
-------------------------------------------

I have used NodeJS' express and sockets to create my multiplayer game. The server.js file in the server folder contains my server codes. 

The client side files for the multiplayer game can be found in the public folder. These are the key files.

1. index.html - *the opening page, where players can indicate whether they want to play a two-player or three-player game*

2. script_words.js - *the word builder (pls see above)*

3. script_index.js - *the client side js for the opening page*

4. app_refactor.js - *the client side js for the game controllers. This js builds on the onePlayer_script.js and onePlayer_scriptwheel.js*

5. style.css - *css style sheet for both the 1-player and multiplayer game*

The most complicated file is app_refactor.js. It contains the different classes for the Player, Wheel and Word, as well as the callback functions of the different event listeners. I was not able to code the event listeners *inline* using arrow functions, as I need to initialise the event listeners by using removeEventListener. An example is indicated below. If I don't do so, there will be multiple event listeners attached to the element. 

```javascript
startButton.removeEventListener("pointerdown", startButtonFnc);    
startButton.addEventListener("pointerdown", startButtonFnc);    
```

The game controllers are coded within the playGame(playerArg) function. 

