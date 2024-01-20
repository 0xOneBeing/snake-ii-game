// const body = document.getElementsByTagName("body")[0];
// body.style.backgroundColor = "rgb(0, 0, 0)";

// Define HTML Elements for manipulation
const board = document.getElementById("game-board");
const instructionText = document.getElementsByClassName("splash")[0];
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");

// Directional in-game buttons
const btnUp = document.getElementById("up");
const btnRight = document.getElementById("right");
const btnDown = document.getElementById("down");
const btnLeft = document.getElementById("left");

// Start Button
const startBtn = document.getElementById("start");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highscore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, and food.
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

//  Draw Snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake of food cube or div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food fxn
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food and position
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Game start fxn
function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Event listener for the start button
startBtn.addEventListener("click", () => {
  startGame();
  startBtn.style.display = "none";
});

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

// Set even listener for keydown
document.addEventListener("keydown", handleKeyPress);

// Button click event listener
function handleButtonClick(buttonId) {
  if (!gameStarted) {
    if (buttonId === "space") {
      startGame();
    }
  } else {
    switch (buttonId) {
      case "up":
        direction = "up";
        break;
      case "down":
        direction = "down";
        break;
      case "left":
        direction = "left";
        break;
      case "right":
        direction = "right";
        break;
    }
  }
}

// Event listeners for directional buttons
btnUp.addEventListener("click", () => {
  handleButtonClick("up");
});

btnRight.addEventListener("click", () => {
  handleButtonClick("right");
});

btnDown.addEventListener("click", () => {
  handleButtonClick("down");
});

btnLeft.addEventListener("click", () => {
  handleButtonClick("left");
});

// Event listener for the space button
document.getElementById("space").addEventListener("click", function () {
  handleButtonClick("space");
});

// Increase speed fxn
function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Check Collision fxn
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// Reset game fxn
function resetGame() {
  updateHighscore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
  startBtn.style.display = "flex";
}

// Update score fxn
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

// Update Highscore fxn
function updateHighscore() {
  const currentScore = snake.length - 1;
  if (currentScore > highscore) {
    highscore = currentScore;
    highScore.textContent = highscore.toString().padStart(3, "0");
  }
  highScore.style.display = "block";
}

// Stop game fxn
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  logo.style.display = "block";
  instructionText.style.display = "block";
}
