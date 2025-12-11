// Cricket Games - Comprehensive Interactive Games

// ==================== GAME STATE ====================
let currentGame = null;
let gameActive = false;
let gameScore = 0;
let gameTimer = 0;
let gameInterval = null;

// High scores stored in localStorage
const highScores = {
    batting: parseInt(localStorage.getItem('batting-highscore')) || 0,
    catching: parseInt(localStorage.getItem('catching-highscore')) || 0,
    trivia: parseInt(localStorage.getItem('trivia-highscore')) || 0,
    bowling: parseInt(localStorage.getItem('bowling-highscore')) || 0,
    memory: localStorage.getItem('memory-highscore') || '--'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeGames();
    updateHighScores();
});

function initializeGames() {
    // Game card click handlers
    document.querySelectorAll('.game-card').forEach(card => {
        const btn = card.querySelector('.btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const game = card.getAttribute('data-game');
            startGame(game);
        });
    });

    // Back to menu buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            stopCurrentGame();
            showScreen('games-menu');
        });
    });

    // Game over buttons
    document.querySelector('.retry-btn').addEventListener('click', retryGame);
    document.querySelector('.menu-btn').addEventListener('click', () => {
        showScreen('games-menu');
    });
}

function startGame(game) {
    currentGame = game;
    gameActive = true;
    gameScore = 0;

    switch (game) {
        case 'batting':
            startBattingGame();
            break;
        case 'catching':
            startCatchingGame();
            break;
        case 'trivia':
            startTriviaGame();
            break;
        case 'bowling':
            startBowlingGame();
            break;
        case 'memory':
            startMemoryGame();
            break;
    }
}

function stopCurrentGame() {
    gameActive = false;
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

function retryGame() {
    if (currentGame) {
        showScreen(currentGame + '-game');
        startGame(currentGame);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.games-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function updateHighScores() {
    document.getElementById('batting-highscore').textContent = highScores.batting;
    document.getElementById('catching-highscore').textContent = highScores.catching;
    document.getElementById('trivia-highscore').textContent = highScores.trivia;
    document.getElementById('bowling-highscore').textContent = highScores.bowling;
    document.getElementById('memory-highscore').textContent = highScores.memory;
}

function saveHighScore(game, score) {
    if (game === 'memory') {
        if (highScores.memory === '--' || score < parseInt(highScores.memory)) {
            highScores.memory = score;
            localStorage.setItem('memory-highscore', score);
        }
    } else {
        if (score > highScores[game]) {
            highScores[game] = score;
            localStorage.setItem(game + '-highscore', score);
        }
    }
    updateHighScores();
}

function showGameOver(score, highScore, message) {
    stopCurrentGame();
    document.getElementById('final-game-score').textContent = score;
    document.getElementById('final-high-score').textContent = highScore;
    document.getElementById('game-over-message').innerHTML = message;
    showScreen('game-over');
}

// ==================== BATTING GAME ====================
let battingBall = { x: 0, y: 0, speed: 5, active: false };
let battingBat = { x: 400, y: 500 };

function startBattingGame() {
    showScreen('batting-game');
    const canvas = document.getElementById('batting-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    gameTimer = 60;
    gameScore = 0;
    document.getElementById('batting-score').textContent = 0;
    document.getElementById('batting-timer').textContent = 60;

    // Timer
    gameInterval = setInterval(() => {
        gameTimer--;
        document.getElementById('batting-timer').textContent = gameTimer;
        if (gameTimer <= 0) {
            endBattingGame();
        }
    }, 1000);

    // Bowl new ball every 2 seconds
    const bowlInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(bowlInterval);
            return;
        }
        bowlNewBall();
    }, 2000);

    // Draw loop
    function draw() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw cricket field
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw pitch
        ctx.fillStyle = '#d4a373';
        ctx.fillRect(300, 0, 200, canvas.height);

        // Draw stumps
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(385, 480, 10, 80);
        ctx.fillRect(395, 480, 10, 80);
        ctx.fillRect(405, 480, 10, 80);

        // Draw bat
        ctx.fillStyle = '#964B00';
        ctx.fillRect(battingBat.x - 40, battingBat.y, 80, 15);

        // Draw ball
        if (battingBall.active) {
            ctx.beginPath();
            ctx.arc(battingBall.x, battingBall.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = '#e74c3c';
            ctx.fill();

            battingBall.y += battingBall.speed;

            // Check if ball reached batsman
            if (battingBall.y >= battingBat.y - 20 && battingBall.y <= battingBat.y + 20) {
                battingBall.active = false;
            } else if (battingBall.y > canvas.height) {
                battingBall.active = false;
            }
        }

        requestAnimationFrame(draw);
    }

    draw();

    // Click/Space to hit
    canvas.addEventListener('click', hitBall);
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && gameActive) {
            hitBall();
        }
    });
}

function bowlNewBall() {
    if (!battingBall.active) {
        battingBall = {
            x: 400,
            y: 50,
            speed: 5 + Math.random() * 3,
            active: true
        };
    }
}

function hitBall() {
    if (battingBall.active && battingBall.y >= battingBat.y - 30 && battingBall.y <= battingBat.y + 30) {
        const runs = Math.floor(Math.random() * 3) * 2 + 4; // 4 or 6
        gameScore += runs;
        document.getElementById('batting-score').textContent = gameScore;
        battingBall.active = false;

        // Visual feedback
        showHitEffect(battingBall.x, battingBall.y);
    }
}

function showHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    document.querySelector('.batting-arena').appendChild(effect);
    setTimeout(() => effect.remove(), 600);
}

function endBattingGame() {
    gameActive = false;
    clearInterval(gameInterval);
    saveHighScore('batting', gameScore);

    let message = '';
    if (gameScore > 50) {
        message = '<h3>🏆 Excellent Batting!</h3><p>Fantastic innings! You hit some amazing shots!</p>';
    } else if (gameScore > 25) {
        message = '<h3>👍 Good Performance!</h3><p>Nice batting display! Keep practicing!</p>';
    } else {
        message = '<h3>🏏 Keep Practicing!</h3><p>Try to time your shots better next time!</p>';
    }

    showGameOver(gameScore, highScores.batting, message);
}

// ==================== CATCHING GAME ====================
let fallingBalls = [];
let catchingMissed = 0;

function startCatchingGame() {
    showScreen('catching-game');
    const canvas = document.getElementById('catching-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    gameTimer = 45;
    gameScore = 0;
    catchingMissed = 0;
    fallingBalls = [];

    document.getElementById('catching-score').textContent = 0;
    document.getElementById('catching-missed').textContent = 0;
    document.getElementById('catching-timer').textContent = 45;

    // Timer
    gameInterval = setInterval(() => {
        gameTimer--;
        document.getElementById('catching-timer').textContent = gameTimer;
        if (gameTimer <= 0) {
            endCatchingGame();
        }
    }, 1000);

    // Spawn balls
    const spawnInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(spawnInterval);
            return;
        }
        spawnBall();
    }, 1000);

    // Draw loop
    function draw() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = '#1e8449';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and update balls
        fallingBalls.forEach((ball, index) => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();

            ball.y += ball.speed;

            if (ball.y > canvas.height + ball.radius) {
                fallingBalls.splice(index, 1);
                catchingMissed++;
                document.getElementById('catching-missed').textContent = catchingMissed;
            }
        });

        requestAnimationFrame(draw);
    }

    draw();

    // Click to catch
    canvas.addEventListener('click', catchBall);
}

function spawnBall() {
    const colors = ['#e74c3c', '#f39c12', '#3498db', '#9b59b6'];
    fallingBalls.push({
        x: Math.random() * 760 + 20,
        y: -20,
        radius: 15 + Math.random() * 10,
        speed: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

function catchBall(event) {
    const canvas = document.getElementById('catching-canvas');
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    fallingBalls.forEach((ball, index) => {
        const distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);
        if (distance < ball.radius) {
            fallingBalls.splice(index, 1);
            gameScore++;
            document.getElementById('catching-score').textContent = gameScore;
        }
    });
}

function endCatchingGame() {
    gameActive = false;
    clearInterval(gameInterval);
    saveHighScore('catching', gameScore);

    let message = '';
    if (gameScore > 30) {
        message = '<h3>🧤 Amazing Catches!</h3><p>Your reflexes are incredible! Great fielding!</p>';
    } else if (gameScore > 15) {
        message = '<h3>👍 Good Catching!</h3><p>Nice reflexes! Keep training!</p>';
    } else {
        message = '<h3>🏏 Practice More!</h3><p>Work on your hand-eye coordination!</p>';
    }

    showGameOver(gameScore, highScores.catching, message);
}

// ==================== TRIVIA SPRINT GAME ====================
const triviaQuestions = [
    { q: "Who has the most Test wickets?", a: ["Muttiah Muralitharan", "Shane Warne", "James Anderson", "Anil Kumble"], c: 0 },
    { q: "Highest ODI score?", a: ["264", "237", "219", "215"], c: 0 },
    { q: "First Cricket World Cup year?", a: ["1975", "1971", "1983", "1979"], c: 0 },
    { q: "Fastest ODI century?", a: ["AB de Villiers", "Shahid Afridi", "Corey Anderson", "Chris Gayle"], c: 0 },
    { q: "Don Bradman's average?", a: ["99.94", "89.50", "95.75", "101.23"], c: 0 },
    { q: "Most ODI runs?", a: ["Sachin Tendulkar", "Virat Kohli", "Ricky Ponting", "Kumar Sangakkara"], c: 0 },
    { q: "First T20 World Cup winner?", a: ["India", "Pakistan", "Australia", "England"], c: 0 },
    { q: "Most sixes in international cricket?", a: ["Chris Gayle", "Shahid Afridi", "Rohit Sharma", "MS Dhoni"], c: 0 },
    { q: "Highest Test score?", a: ["Brian Lara - 400*", "Matthew Hayden - 380", "Mahela Jayawardene - 374", "Virender Sehwag - 319"], c: 0 },
    { q: "Most World Cup wins?", a: ["Australia - 5", "India - 2", "West Indies - 2", "England - 1"], c: 0 }
];

let triviaIndex = 0;
let triviaTimer = 10;

function startTriviaGame() {
    showScreen('trivia-game');
    gameScore = 0;
    triviaIndex = 0;

    loadTriviaQuestion();
}

function loadTriviaQuestion() {
    if (triviaIndex >= 10) {
        endTriviaGame();
        return;
    }

    const question = triviaQuestions[triviaIndex];

    document.getElementById('trivia-current').textContent = triviaIndex + 1;
    document.getElementById('trivia-score').textContent = gameScore;
    document.getElementById('trivia-question').textContent = question.q;

    const optionsHtml = question.a.map((option, index) => `
        <div class="trivia-option" data-index="${index}">${option}</div>
    `).join('');

    document.getElementById('trivia-options').innerHTML = optionsHtml;

    // Add click handlers
    document.querySelectorAll('.trivia-option').forEach(opt => {
        opt.addEventListener('click', () => selectTriviaAnswer(opt, question.c));
    });

    // Start timer
    triviaTimer = 10;
    document.getElementById('trivia-timer').textContent = triviaTimer;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        triviaTimer--;
        document.getElementById('trivia-timer').textContent = triviaTimer;

        if (triviaTimer <= 0) {
            clearInterval(gameInterval);
            triviaIndex++;
            setTimeout(loadTriviaQuestion, 1000);
        }
    }, 1000);
}

function selectTriviaAnswer(selected, correctIndex) {
    clearInterval(gameInterval);

    const selectedIndex = parseInt(selected.getAttribute('data-index'));

    document.querySelectorAll('.trivia-option').forEach(opt => opt.classList.add('disabled'));

    if (selectedIndex === correctIndex) {
        selected.classList.add('correct');
        gameScore += 10;
    } else {
        selected.classList.add('wrong');
        document.querySelectorAll('.trivia-option')[correctIndex].classList.add('correct');
    }

    triviaIndex++;
    setTimeout(loadTriviaQuestion, 1500);
}

function endTriviaGame() {
    gameActive = false;
    saveHighScore('trivia', gameScore);

    let message = '';
    if (gameScore >= 80) {
        message = '<h3>🧠 Cricket Genius!</h3><p>Perfect knowledge! You know everything!</p>';
    } else if (gameScore >= 50) {
        message = '<h3>📚 Great Knowledge!</h3><p>You know your cricket trivia well!</p>';
    } else {
        message = '<h3>📖 Keep Learning!</h3><p>Study more cricket facts and records!</p>';
    }

    showGameOver(gameScore, highScores.trivia, message);
}

// ==================== BOWLING GAME ====================
let bowlingStumps = { x: 400, y: 450, width: 60, height: 100 };

function startBowlingGame() {
    showScreen('bowling-game');
    const canvas = document.getElementById('bowling-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    gameTimer = 60;
    gameScore = 0;

    document.getElementById('bowling-score').textContent = 0;
    document.getElementById('bowling-timer').textContent = 60;

    // Timer
    gameInterval = setInterval(() => {
        gameTimer--;
        document.getElementById('bowling-timer').textContent = gameTimer;
        if (gameTimer <= 0) {
            endBowlingGame();
        }
    }, 1000);

    // Draw
    function draw() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pitch
        ctx.fillStyle = '#d4a373';
        ctx.fillRect(300, 0, 200, canvas.height);

        // Draw stumps
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(bowlingStumps.x - 25, bowlingStumps.y, 10, bowlingStumps.height);
        ctx.fillRect(bowlingStumps.x, bowlingStumps.y, 10, bowlingStumps.height);
        ctx.fillRect(bowlingStumps.x + 25, bowlingStumps.y, 10, bowlingStumps.height);

        // Bails
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(bowlingStumps.x - 25, bowlingStumps.y - 5, 60, 5);

        requestAnimationFrame(draw);
    }

    draw();

    // Click to bowl
    canvas.addEventListener('click', (e) => throwBall(e, canvas, ctx));
}

function throwBall(event, canvas, ctx) {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    // Check if hit stumps
    if (targetX >= bowlingStumps.x - 30 && targetX <= bowlingStumps.x + 30 &&
        targetY >= bowlingStumps.y && targetY <= bowlingStumps.y + bowlingStumps.height) {
        gameScore += 10;
        document.getElementById('bowling-score').textContent = gameScore;

        // Visual feedback
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

function endBowlingGame() {
    gameActive = false;
    clearInterval(gameInterval);
    saveHighScore('bowling', gameScore);

    let message = '';
    if (gameScore > 80) {
        message = '<h3>🎳 Perfect Bowling!</h3><p>Incredible accuracy! You hit the stumps every time!</p>';
    } else if (gameScore > 40) {
        message = '<h3>👍 Good Bowling!</h3><p>Nice accuracy! Keep practicing!</p>';
    } else {
        message = '<h3>🎯 Practice Your Line!</h3><p>Work on your bowling accuracy!</p>';
    }

    showGameOver(gameScore, highScores.bowling, message);
}

// ==================== MEMORY GAME ====================
const memoryIcons = ['🏏', '🎳', '🏆', '⭐', '🧤', '🎯', '⚡', '🔥'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;
let memoryStartTime = 0;

function startMemoryGame() {
    showScreen('memory-game');

    // Prepare cards
    memoryCards = [...memoryIcons, ...memoryIcons];
    memoryCards = shuffleArray(memoryCards);

    matchedPairs = 0;
    memoryMoves = 0;
    flippedCards = [];
    memoryStartTime = Date.now();

    document.getElementById('memory-moves').textContent = 0;
    document.getElementById('memory-matched').textContent = 0;

    // Timer
    gameInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
        document.getElementById('memory-timer').textContent = elapsed;
    }, 1000);

    // Create grid
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = memoryCards.map((icon, index) => `
        <div class="memory-card" data-index="${index}" data-icon="${icon}">
            <div class="memory-card-front">?</div>
            <div class="memory-card-back">${icon}</div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => flipMemoryCard(card));
    });
}

function flipMemoryCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').textContent = memoryMoves;

        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [card1, card2] = flippedCards;
    const icon1 = card1.getAttribute('data-icon');
    const icon2 = card2.getAttribute('data-icon');

    if (icon1 === icon2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('memory-matched').textContent = matchedPairs;
        flippedCards = [];

        if (matchedPairs === 8) {
            endMemoryGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endMemoryGame() {
    clearInterval(gameInterval);
    const finalTime = Math.floor((Date.now() - memoryStartTime) / 1000);
    saveHighScore('memory', finalTime);

    let message = '';
    if (finalTime < 60) {
        message = '<h3>🧠 Lightning Fast!</h3><p>Amazing memory and speed!</p>';
    } else if (finalTime < 120) {
        message = '<h3>👍 Great Memory!</h3><p>Well done! You matched all pairs!</p>';
    } else {
        message = '<h3>🎯 Good Effort!</h3><p>Keep practicing to improve your time!</p>';
    }

    document.getElementById('final-game-score').textContent = finalTime + 's';
    document.getElementById('final-high-score').textContent = highScores.memory;
    document.getElementById('game-over-message').innerHTML = message;
    showScreen('game-over');
}

// ==================== UTILITY FUNCTIONS ====================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
