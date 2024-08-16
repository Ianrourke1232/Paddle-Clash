// Select DOM elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.querySelector('.game-container');
const gameCanvas = document.getElementById('gameCanvas');
const scoreDisplay = document.getElementById('score');

const ctx = gameCanvas.getContext('2d');

let playerScore = 0;
let aiScore = 0;

const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 10;

let playerPaddle = {
    x: 10,
    y: (gameCanvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let aiPaddle = {
    x: gameCanvas.width - paddleWidth - 10,
    y: (gameCanvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4 // AI speed
};

let ball = {
    x: gameCanvas.width / 2,
    y: gameCanvas.height / 2,
    size: ballSize,
    dx: 4,
    dy: 4
};

// Function to start the game
function startGame() {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    resetGame();
    gameLoop();
}

// Function to reset the game
function resetGame() {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    playerPaddle.y = (gameCanvas.height - paddleHeight) / 2;
    aiPaddle.x = gameCanvas.width - paddleWidth - 10;
    aiPaddle.y = (gameCanvas.height - paddleHeight) / 2;
    
    ball.x = gameCanvas.width / 2;
    ball.y = gameCanvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Function to draw the paddles and ball
function draw() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw player paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

    // Draw AI paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Function to update the paddle positions and ball movement
function update() {
    playerPaddle.y += playerPaddle.dy;

    // Prevent player paddle from going out of bounds
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + paddleHeight > gameCanvas.height) playerPaddle.y = gameCanvas.height - paddleHeight;

    // Move AI paddle
    if (ball.y > aiPaddle.y + paddleHeight / 2) {
        aiPaddle.y += aiPaddle.dy;
    } else {
        aiPaddle.y -= aiPaddle.dy;
    }

    // Prevent AI paddle from going out of bounds
    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y + paddleHeight > gameCanvas.height) aiPaddle.y = gameCanvas.height - paddleHeight;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.size > gameCanvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Ball collision with player paddle
    if (ball.x - ball.size < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx *= -1;
    }

    // Ball collision with AI paddle
    if (ball.x + ball.size > aiPaddle.x &&
        ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.dx *= -1;
    }

    // Ball goes out of bounds
    if (ball.x - ball.size < 0) {
        aiScore++;
        resetGame();
    } else if (ball.x + ball.size > gameCanvas.width) {
        playerScore++;
        resetGame();
    }

    // Update score display
    scoreDisplay.textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

// Main game loop
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Event listeners for paddle movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
        playerPaddle.dy = -8;
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        playerPaddle.dy = 8;
    }
});

document.addEventListener('keyup', () => {
    playerPaddle.dy = 0;
});

// Start game on pressing Enter
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});
