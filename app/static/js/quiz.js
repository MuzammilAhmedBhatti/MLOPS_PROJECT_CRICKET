// Cricket Quiz - Comprehensive Question Bank & Logic

// ==================== QUIZ STATE ====================
let selectedCategory = 'all';
let selectedDifficulty = 'easy';
let currentQuestionIndex = 0;
let score = 0;
let timer = 30;
let timerInterval;
let startTime;
let quizQuestions = [];
let userAnswers = [];

// ==================== COMPREHENSIVE QUESTION BANK ====================
const questionBank = {
    batting: [
        {
            question: "Who holds the record for the highest individual score in Test cricket?",
            options: ["Brian Lara - 400*", "Matthew Hayden - 380", "Mahela Jayawardene - 374", "Virender Sehwag - 319"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Which player has scored the most international centuries?",
            options: ["Sachin Tendulkar", "Virat Kohli", "Ricky Ponting", "Jacques Kallis"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "Who scored the fastest ODI century (in terms of balls)?",
            options: ["Corey Anderson", "AB de Villiers", "Shahid Afridi", "Chris Gayle"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "What is Don Bradman's legendary Test batting average?",
            options: ["89.50", "95.75", "99.94", "101.23"],
            correct: 2,
            difficulty: "hard"
        },
        {
            question: "Who scored 6 sixes in an over against England in the 2007 T20 World Cup?",
            options: ["Yuvraj Singh", "MS Dhoni", "Rohit Sharma", "Chris Gayle"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "Which batsman has the highest ODI score?",
            options: ["Virender Sehwag - 219", "Rohit Sharma - 264", "Martin Guptill - 237", "Chris Gayle - 215"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "Who was the first batsman to score a double century in ODI cricket?",
            options: ["Sachin Tendulkar", "Virender Sehwag", "Chris Gayle", "Rohit Sharma"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "Which player has hit the most sixes in international cricket?",
            options: ["Shahid Afridi", "Chris Gayle", "Brendon McCullum", "MS Dhoni"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "What is the fastest Test century ever scored?",
            options: ["Brendon McCullum - 54 balls", "Viv Richards - 56 balls", "Adam Gilchrist - 57 balls", "Ben Stokes - 85 balls"],
            correct: 0,
            difficulty: "hard"
        },
        {
            question: "Who scored 10 double centuries in Test cricket, the most by any batsman?",
            options: ["Kumar Sangakkara", "Brian Lara", "Don Bradman", "Virat Kohli"],
            correct: 0,
            difficulty: "hard"
        }
    ],
    bowling: [
        {
            question: "Who has taken the most wickets in Test cricket?",
            options: ["Shane Warne", "Muttiah Muralitharan", "Anil Kumble", "James Anderson"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "What are the best bowling figures in Test cricket?",
            options: ["Jim Laker - 10/53", "Anil Kumble - 10/74", "Bob Massie - 16/137", "Muttiah Muralitharan - 9/51"],
            correct: 0,
            difficulty: "hard"
        },
        {
            question: "Who bowled the fastest ball ever recorded in cricket?",
            options: ["Brett Lee", "Shoaib Akhtar", "Mitchell Starc", "Shaun Tait"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "How many wickets did Anil Kumble take in an innings against Pakistan?",
            options: ["8 wickets", "9 wickets", "10 wickets", "7 wickets"],
            correct: 2,
            difficulty: "easy"
        },
        {
            question: "Who has the best bowling figures in ODI cricket?",
            options: ["Chaminda Vaas - 8/19", "Muttiah Muralitharan - 7/30", "Glenn McGrath - 7/15", "Shahid Afridi - 7/12"],
            correct: 0,
            difficulty: "hard"
        },
        {
            question: "Which bowler has taken the most wickets in ODI cricket?",
            options: ["Wasim Akram", "Muttiah Muralitharan", "Waqar Younis", "Lasith Malinga"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "Who was the first bowler to take a hat-trick in World Cup cricket?",
            options: ["Chetan Sharma", "Wasim Akram", "Saqlain Mushtaq", "Brett Lee"],
            correct: 0,
            difficulty: "hard"
        },
        {
            question: "How many wickets did Shane Warne take in his Test career?",
            options: ["639", "708", "563", "800"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "Which bowler has the most 5-wicket hauls in Test cricket?",
            options: ["Muttiah Muralitharan", "Shane Warne", "Richard Hadlee", "James Anderson"],
            correct: 0,
            difficulty: "hard"
        },
        {
            question: "Who took 4 wickets in 4 balls in a Test match?",
            options: ["Lasith Malinga", "Rashid Khan", "Curtis Campher", "Wasim Akram"],
            correct: 0,
            difficulty: "hard"
        }
    ],
    history: [
        {
            question: "When was the first official Test match played?",
            options: ["1877", "1882", "1890", "1900"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Which two teams played the first ever Test match?",
            options: ["England vs Australia", "England vs West Indies", "Australia vs South Africa", "India vs Pakistan"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "When was the first ODI match played?",
            options: ["1965", "1971", "1975", "1980"],
            correct: 1,
            difficulty: "hard"
        },
        {
            question: "When was the ICC (Imperial Cricket Conference) formed?",
            options: ["1877", "1909", "1926", "1947"],
            correct: 1,
            difficulty: "hard"
        },
        {
            question: "What does 'The Ashes' refer to?",
            options: ["England vs Australia Test series", "First World Cup trophy", "Cricket's origin story", "Burnt cricket bat"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "When was T20 cricket officially introduced?",
            options: ["1999", "2003", "2007", "2008"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "Which country hosted the first Cricket World Cup?",
            options: ["Australia", "England", "India", "West Indies"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "When was the Indian Premier League (IPL) launched?",
            options: ["2005", "2008", "2010", "2012"],
            correct: 1,
            difficulty: "medium"
        },
        {
            question: "Which was the first country to introduce Day-Night Test cricket with pink ball?",
            options: ["England", "Australia", "India", "New Zealand"],
            correct: 1,
            difficulty: "hard"
        },
        {
            question: "When did cricket become a professional sport in England?",
            options: ["1863", "1890", "1909", "1926"],
            correct: 0,
            difficulty: "hard"
        }
    ],
    worldcup: [
        {
            question: "Which team won the first Cricket World Cup in 1975?",
            options: ["Australia", "West Indies", "England", "India"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "How many times has Australia won the ODI World Cup?",
            options: ["3", "4", "5", "6"],
            correct: 2,
            difficulty: "medium"
        },
        {
            question: "Which country won the 2019 Cricket World Cup?",
            options: ["England", "New Zealand", "India", "Australia"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "Who was the highest run-scorer in the 2011 World Cup?",
            options: ["Sachin Tendulkar", "Tillakaratne Dilshan", "Kumar Sangakkara", "Yuvraj Singh"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Which team won the first T20 World Cup in 2007?",
            options: ["Australia", "India", "Pakistan", "Sri Lanka"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "How many World Cups has India won?",
            options: ["1", "2", "3", "4"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "Which player has scored the most runs in World Cup history?",
            options: ["Sachin Tendulkar", "Ricky Ponting", "Virat Kohli", "Kumar Sangakkara"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Who won the 2019 World Cup final based on boundary count?",
            options: ["England", "New Zealand", "It was tied", "Australia"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Which country has never won a Cricket World Cup?",
            options: ["New Zealand", "West Indies", "Pakistan", "England"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "Who was Man of the Tournament in the 1983 World Cup?",
            options: ["Kapil Dev", "Mohinder Amarnath", "Sunil Gavaskar", "Ravi Shastri"],
            correct: 1,
            difficulty: "hard"
        }
    ],
    players: [
        {
            question: "Which country did Sachin Tendulkar represent?",
            options: ["Pakistan", "India", "Sri Lanka", "Bangladesh"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "What was MS Dhoni's primary role?",
            options: ["Batsman", "Bowler", "Wicket-keeper batsman", "All-rounder"],
            correct: 2,
            difficulty: "easy"
        },
        {
            question: "Which player is known as 'The God of Cricket'?",
            options: ["Virat Kohli", "Sachin Tendulkar", "Brian Lara", "Ricky Ponting"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "Who captained the Indian team to victory in the 2011 World Cup?",
            options: ["Sourav Ganguly", "Rahul Dravid", "MS Dhoni", "Virat Kohli"],
            correct: 2,
            difficulty: "easy"
        },
        {
            question: "Which player is nicknamed 'The Wall'?",
            options: ["Rahul Dravid", "Steve Waugh", "Jacques Kallis", "Kumar Sangakkara"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "Who is the only player to score 100 international centuries?",
            options: ["Ricky Ponting", "Virat Kohli", "Sachin Tendulkar", "Jacques Kallis"],
            correct: 2,
            difficulty: "medium"
        },
        {
            question: "Which player is known as 'Captain Cool'?",
            options: ["Ricky Ponting", "MS Dhoni", "Michael Clarke", "Kane Williamson"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "Who is the fastest bowler to reach 300 Test wickets?",
            options: ["Dale Steyn", "Dennis Lillee", "Malcolm Marshall", "Glenn McGrath"],
            correct: 2,
            difficulty: "hard"
        },
        {
            question: "Which player has the nickname 'Universe Boss'?",
            options: ["AB de Villiers", "Chris Gayle", "Virat Kohli", "David Warner"],
            correct: 1,
            difficulty: "easy"
        },
        {
            question: "Who was Sir Don Bradman?",
            options: ["English captain", "Australian batsman", "West Indies bowler", "South African all-rounder"],
            correct: 1,
            difficulty: "easy"
        }
    ]
};

// Generate more questions to reach 100+
function generateAdditionalQuestions() {
    const additionalQuestions = {
        batting: [
            { question: "Who has the most runs in T20 Internationals?", options: ["Virat Kohli", "Rohit Sharma", "Martin Guptill", "Chris Gayle"], correct: 0, difficulty: "medium" },
            { question: "Which player scored 264 in an ODI match?", options: ["Rohit Sharma", "Virender Sehwag", "Chris Gayle", "AB de Villiers"], correct: 0, difficulty: "easy" },
            { question: "Who was the first batsman to score 10,000 runs in ODI cricket?", options: ["Sachin Tendulkar", "Ricky Ponting", "Sourav Ganguly", "Desmond Haynes"], correct: 0, difficulty: "hard" },
            { question: "Which batsman has the highest strike rate in T20 cricket (minimum 1000 runs)?", options: ["Andre Russell", "Chris Gayle", "AB de Villiers", "Glenn Maxwell"], correct: 0, difficulty: "hard" },
            { question: "Who scored the first century in T20 International cricket?", options: ["Chris Gayle", "Brendon McCullum", "Suresh Raina", "Mahela Jayawardene"], correct: 1, difficulty: "hard" }
        ],
        bowling: [
            { question: "Who has the best economy rate in ODI cricket (minimum 2000 balls)?", options: ["Joel Garner", "Michael Holding", "Curtly Ambrose", "Glenn McGrath"], correct: 0, difficulty: "hard" },
            { question: "Which bowler has taken the most T20I wickets?", options: ["Lasith Malinga", "Shahid Afridi", "Shakib Al Hasan", "Rashid Khan"], correct: 2, difficulty: "medium" },
            { question: "Who was the first bowler to take 500 Test wickets?", options: ["Courtney Walsh", "Shane Warne", "Muttiah Muralitharan", "Glenn McGrath"], correct: 0, difficulty: "hard" },
            { question: "Which bowler has the most wickets in a single World Cup?", options: ["Glenn McGrath", "Mitchell Starc", "Muttiah Muralitharan", "Wasim Akram"], correct: 1, difficulty: "medium" },
            { question: "Who bowled the 'Ball of the Century' to Mike Gatting?", options: ["Shane Warne", "Muttiah Muralitharan", "Anil Kumble", "Saqlain Mushtaq"], correct: 0, difficulty: "medium" }
        ],
        history: [
            { question: "Which cricket ground is known as the 'Home of Cricket'?", options: ["MCG", "Lord's", "Eden Gardens", "SCG"], correct: 1, difficulty: "easy" },
            { question: "When was the first women's Test match played?", options: ["1934", "1947", "1958", "1973"], correct: 0, difficulty: "hard" },
            { question: "Which was the first country to tour England for cricket?", options: ["Australia", "West Indies", "India", "South Africa"], correct: 0, difficulty: "medium" },
            { question: "When did cricket become a 6-ball over game universally?", options: ["1900", "1947", "1979", "1988"], correct: 2, difficulty: "hard" },
            { question: "What was the original color of cricket balls?", options: ["White", "Red", "Pink", "Yellow"], correct: 1, difficulty: "easy" }
        ],
        worldcup: [
            { question: "Who scored the fastest century in World Cup history?", options: ["Glenn Maxwell", "AB de Villiers", "Kevin O'Brien", "Kapil Dev"], correct: 2, difficulty: "hard" },
            { question: "Which team has appeared in the most World Cup finals?", options: ["Australia", "India", "West Indies", "England"], correct: 0, difficulty: "medium" },
            { question: "Who was the youngest player to play in a World Cup?", options: ["Sachin Tendulkar", "Shahid Afridi", "Hasan Raza", "Mushtaq Mohammad"], correct: 3, difficulty: "hard" },
            { question: "How many times has West Indies won the World Cup?", options: ["1", "2", "3", "4"], correct: 1, difficulty: "easy" },
            { question: "Which country hosted the World Cup jointly with others in 2011?", options: ["India", "Sri Lanka", "Bangladesh", "All of these"], correct: 3, difficulty: "easy" }
        ],
        players: [
            { question: "Who is known as 'Dada' in cricket?", options: ["Sourav Ganguly", "Rahul Dravid", "VVS Laxman", "Anil Kumble"], correct: 0, difficulty: "easy" },
            { question: "Which player hit 6 sixes in a single T20 over?", options: ["Yuvraj Singh", "Chris Gayle", "Kieron Pollard", "All of these"], correct: 3, difficulty: "medium" },
            { question: "Who is the only player to score a century and take 10 wickets in a Test match?", options: ["Imran Khan", "Ian Botham", "Kapil Dev", "None achieved this"], correct: 3, difficulty: "hard" },
            { question: "Which player retired from international cricket after the 2011 World Cup?", options: ["Rahul Dravid", "Sachin Tendulkar", "VVS Laxman", "Gautam Gambhir"], correct: 0, difficulty: "medium" },
            { question: "Who is the youngest player to score a Test century?", options: ["Mohammad Ashraful", "Sachin Tendulkar", "Shahid Afridi", "Garfield Sobers"], correct: 0, difficulty: "hard" }
        ]
    };

    // Merge additional questions
    Object.keys(additionalQuestions).forEach(category => {
        questionBank[category] = [...questionBank[category], ...additionalQuestions[category]];
    });
}

generateAdditionalQuestions();

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});

function initializeQuiz() {
    // Category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCategory = card.getAttribute('data-category');
        });
    });

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDifficulty = btn.getAttribute('data-difficulty');
        });
    });

    // Start quiz
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);

    // Quit quiz
    document.getElementById('quit-quiz').addEventListener('click', () => {
        if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
            resetQuiz();
        }
    });

    // Retake quiz
    document.getElementById('retake-quiz').addEventListener('click', resetQuiz);
}

// ==================== QUIZ CONTROL ====================
function startQuiz() {
    // Prepare questions
    quizQuestions = prepareQuestions();
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    startTime = Date.now();

    // Show question screen
    showScreen('quiz-question');
    loadQuestion();
}

function prepareQuestions() {
    let questions = [];

    if (selectedCategory === 'all') {
        // Mix questions from all categories
        Object.values(questionBank).forEach(categoryQuestions => {
            questions = [...questions, ...categoryQuestions];
        });
    } else {
        questions = questionBank[selectedCategory];
    }

    // Filter by difficulty
    questions = questions.filter(q => q.difficulty === selectedDifficulty);

    // Shuffle and take 10 questions
    questions = shuffleArray(questions).slice(0, 10);

    return questions;
}

function loadQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];

    // Update progress
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = quizQuestions.length;
    document.getElementById('current-score').textContent = score;

    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    // Display question
    document.getElementById('question-category').textContent = getCategoryName(question);
    document.getElementById('question-text').textContent = question.question;

    // Display options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <div class="option" data-index="${index}">
            <span>${option}</span>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => selectAnswer(option));
    });

    // Start timer
    startTimer();
}

function selectAnswer(selectedOption) {
    clearInterval(timerInterval);

    const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;

    // Disable all options
    document.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));

    // Show correct/wrong
    if (isCorrect) {
        selectedOption.classList.add('correct');
        score++;
        userAnswers.push({ correct: true, time: 30 - timer });
    } else {
        selectedOption.classList.add('wrong');
        document.querySelectorAll('.option')[question.correct].classList.add('correct');
        userAnswers.push({ correct: false, time: 30 - timer });
    }

    // Next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

function startTimer() {
    timer = 30;
    document.getElementById('timer').textContent = timer;

    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = timer;

        if (timer <= 0) {
            clearInterval(timerInterval);
            // Auto-submit as wrong answer
            userAnswers.push({ correct: false, time: 30 });
            currentQuestionIndex++;
            setTimeout(() => loadQuestion(), 1000);
        }
    }, 1000);
}

function showResults() {
    clearInterval(timerInterval);

    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswers = userAnswers.filter(a => a.correct).length;
    const wrongAnswers = userAnswers.length - correctAnswers;
    const accuracy = Math.round((correctAnswers / userAnswers.length) * 100);

    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = quizQuestions.length;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('wrong-answers').textContent = wrongAnswers;
    document.getElementById('total-time').textContent = `${totalTime}s`;
    document.getElementById('accuracy').textContent = `${accuracy}%`;

    // Results message
    let message = '';
    if (accuracy >= 90) {
        message = '<h3>🏆 Outstanding!</h3><p>You\'re a cricket genius! Phenomenal knowledge!</p>';
        triggerConfetti();
    } else if (accuracy >= 70) {
        message = '<h3>🎯 Excellent!</h3><p>Great performance! You know your cricket well!</p>';
    } else if (accuracy >= 50) {
        message = '<h3>👍 Good Job!</h3><p>Decent score! Keep learning more about cricket!</p>';
    } else {
        message = '<h3>📚 Keep Learning!</h3><p>Don\'t give up! There\'s so much cricket to explore!</p>';
    }
    document.getElementById('results-message').innerHTML = message;

    showScreen('quiz-results');
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    clearInterval(timerInterval);
    showScreen('quiz-start');
}

function showScreen(screenId) {
    document.querySelectorAll('.quiz-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function getCategoryName(question) {
    for (const [category, questions] of Object.entries(questionBank)) {
        if (questions.includes(question)) {
            return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }
    return 'General';
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== CONFETTI ANIMATION ====================
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const confettiCount = 150;
    const colors = ['#2ecc71', '#f39c12', '#3498db', '#e74c3c', '#9b59b6'];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 5);
            ctx.stroke();

            c.tiltAngle += c.tiltAngleIncremental;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(c.d);
            c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;

            if (c.y > canvas.height) {
                confetti[i] = {
                    ...c,
                    x: Math.random() * canvas.width,
                    y: -30,
                    tilt: Math.floor(Math.random() * 10) - 10
                };
            }
        });

        requestAnimationFrame(drawConfetti);
    }

    drawConfetti();
    setTimeout(() => {
        canvas.width = 0;
        canvas.height = 0;
    }, 5000);
}
