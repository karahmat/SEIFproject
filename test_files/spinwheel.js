const wheel = document.querySelector("#wheel");
const button = document.querySelector("#startButton");
let deg = 0;
let timer = 2;
let timerInterval;

// startButton.addEventListener("pointerdown", () => {
//     timerInterval = setInterval( () => {
//         timer = timer + 0.5;        
//     }, 500);     
    
// })

startButton.addEventListener("click", () => {
    
    startButton.style.pointerEvents = 'none';
    deg = 360*5*timer + Math.floor(Math.random()*360*2);    
    wheel.style.transform = "rotate("+deg+"deg)";
    wheel.style.transition = "all 10s ease-out";    
});

wheel.addEventListener("transitionend", () => {
    // Enable button when spin is over
    startButton.style.pointerEvents = 'auto';
    wheel.style.transition = "none";
    const actualDeg = deg % 360;
    wheel.style.transform = "rotate("+actualDeg+"deg)";

    // clearInterval(timerInterval);
    // timer=0; 
})
