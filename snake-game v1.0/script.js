const playSpace = document.querySelector(".play-space");
const scores = document.querySelector(".score");
const highScore = document.querySelector(".high-score");
const controlButtons = document.querySelectorAll(".controls i");


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let speedX = 1, speedY = 0;
let settingInterval;
let score = 0;


function startGame() {
    toggleScreen("start-screen", false);
    toggleScreen("wrap", true);
    randomizeFoodPosition();
    gameFood(); // call gameFood() here to make the snake move immediately
    settingInterval = setInterval(gameFood, 85)
    document.addEventListener("keydown", directionChange);
}

function toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = (toggle) ? "block" : "none";
    element.style.display = display;
}



// gets the highest score from the local storage
let highestScore = localStorage.getItem("high-score") || 0;
highScore.innerText = `High Score: ${highestScore}`;

// random positions for food from 0-30
const randomizeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}


const handlingGameIsOver = () => {
    // clearing the timer and reloading the page when the game is over.
    clearInterval(settingInterval);
    alert("Game Over :( Press OK to return to start screen...")
    location.reload();

};


const directionChange = (e) => {
    // changing the speed based on key presses
    if (e.key === "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (e.key === "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    }
    else if (e.key === "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    }
    else if (e.key === "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }


}

controlButtons.forEach(key => {
    // calling directionChange on each key click and passing dataset value as an object.
    key.addEventListener("click", () => directionChange({ key: key.dataset.key }));
});

const gameFood = () => {
    if (gameOver) return handlingGameIsOver();
    let htmlMarkup = `<div class= "food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // check if the snake and food touched
    if (snakeX === foodX && snakeY === foodY) {
        randomizeFoodPosition();
        snakeBody.push([foodX, foodY]); // pushing food postition to snake body array
        score++; // increments score by 1

        highestScore = score >= highestScore ? score : highestScore;
        localStorage.setItem("high-score", highestScore);
        scores.innerText = `Score: ${score}`;
        highScore.innerText = `High Score: ${highestScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // setting the first element of the snake body to the current snake position

    // updating the snake's position based on the current speed
    snakeX += speedX;
    snakeY += speedY;

    // Checking if snake is out of bounds, if so setting gameOver to true;
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30)
        gameOver = true;

    for (let i = 0; i < snakeBody.length; i++) {
        // adding a div for each part of the snake's body
        htmlMarkup += `<div class= "head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // checking if the snake hit its own body, if so then game over set to be true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playSpace.innerHTML = htmlMarkup;

}