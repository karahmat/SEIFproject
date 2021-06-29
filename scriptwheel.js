
(function() {
    const wheel = document.querySelector('.wheel');
    const startButton = document.querySelector('.button');
    const resultShow = document.querySelector('.result');

    let timer = 0;
    let timerInterval;
    let deg = 0;
    let segmentSize = 30; //deg per segment of the wheel

    const symbolSegments = {
        1: "yellow",
        2: "orange",
        3: "red",
        4: "dark pink",
        5: "pink",
        6: "purple",
        7: "dark purple",
        8: "dark blue",
        9: "light blue",
        10: "pastel green",
        11: "normal green",
        12: "light green"
    }

    const chosenSegment = (actualDeg) => {
        const winningSegmentNr = Math.ceil(actualDeg / segmentSize);
        console.log("Segment Nr: "+winningSegmentNr);
        resultShow.innerHTML = symbolSegments[winningSegmentNr];
    };
  
    startButton.addEventListener('pointerdown', (event) => {
        resultShow.innerHTML = "-";
        timerInterval = setInterval( () => {
            timer = timer + 0.5;
            console.log(timer);
        }, 400);
    });

    startButton.addEventListener('pointerup', (event) => {
        console.log(event.type);
            // Disable button during spin
        startButton.style.pointerEvents = 'none';
            // Calculate a new rotation which depends on how long one presses the button plus some randomness
        deg = Math.floor(timer*1000+Math.floor(Math.random()*700)+360);
            // Set the transition on the wheel
        wheel.style.transition = 'all 10s ease-out';
            // Rotate the wheel
        wheel.style.transform = `rotate(${deg}deg)`;
            // Apply the blur
        wheel.classList.add('blur');
        clearInterval(timerInterval);
        timer=0;

    });
  
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
      //Calculate and display the winning segment;
      chosenSegment(actualDeg);
    });
  })();