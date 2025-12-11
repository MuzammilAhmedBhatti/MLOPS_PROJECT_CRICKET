// Dashboard JavaScript - Comprehensive Cricket Data & Interactions

// ==================== NAVIGATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Section navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');

            // Scroll to top of main content
            document.querySelector('.dashboard-main').scrollTop = 0;
        });
    });

    // Initialize content
    loadPlayers();
    loadRankings();
    loadHistory();
    loadRules();
    loadIconicMatches();
    loadTournaments();
    loadFacts();
    initLiveScore();
});

// ==================== PLAYER PROFILES ====================
const cricketPlayers = [
    {
        name: 'Sachin Tendulkar',
        role: 'Batsman',
        country: '🇮🇳 India',
        icon: '👑',
        stats: {
            'Test Runs': '15,921',
            'ODI Runs': '18,426',
            'Test Average': '53.78',
            'Centuries': '100',
            'Highest Score': '248*'
        }
    },
    {
        name: 'Virat Kohli',
        role: 'Batsman',
        country: '🇮🇳 India',
        icon: '⭐',
        stats: {
            'Test Runs': '8,000+',
            'ODI Runs': '13,000+',
            'ODI Average': '58+',
            'Centuries': '75+',
            'Highest Score': '254*'
        }
    },
    {
        name: 'Brian Lara',
        role: 'Batsman',
        country: '🏴 West Indies',
        icon: '🦁',
        stats: {
            'Test Runs': '11,953',
            'ODI Runs': '10,405',
            'Test Average': '52.88',
            'Highest Score': '400*',
            'Strike Rate': '79.51'
        }
    },
    {
        name: 'Shane Warne',
        role: 'Bowler',
        country: '🇦🇺 Australia',
        icon: '🎳',
        stats: {
            'Test Wickets': '708',
            'ODI Wickets': '293',
            'Best Bowling': '8/71',
            'Economy': '2.65',
            'Strike Rate': '57.4'
        }
    },
    {
        name: 'MS Dhoni',
        role: 'Wicket-keeper',
        country: '🇮🇳 India',
        icon: '🧤',
        stats: {
            'ODI Runs': '10,773',
            'T20I Runs': '1,617',
            'Stumpings': '195',
            'Catches': '444',
            'Captain Wins': '332'
        }
    },
    {
        name: 'AB de Villiers',
        role: 'Batsman',
        country: '🇿🇦 South Africa',
        icon: '💥',
        stats: {
            'Test Runs': '8,765',
            'ODI Runs': '9,577',
            'Strike Rate': '101.09',
            'Fastest ODI 50': '16 balls',
            'Fastest ODI 100': '31 balls'
        }
    },
    {
        name: 'Muttiah Muralitharan',
        role: 'Bowler',
        country: '🇱🇰 Sri Lanka',
        icon: '🌀',
        stats: {
            'Test Wickets': '800',
            'ODI Wickets': '534',
            'Best Bowling': '9/51',
            '5-wicket hauls': '77',
            '10-wicket hauls': '22'
        }
    },
    {
        name: 'Ricky Ponting',
        role: 'Batsman',
        country: '🇦🇺 Australia',
        icon: '🏆',
        stats: {
            'Test Runs': '13,378',
            'ODI Runs': '13,704',
            'Centuries': '71',
            'World Cups Won': '3',
            'Catches': '364'
        }
    },
    {
        name: 'Jacques Kallis',
        role: 'All-rounder',
        country: '🇿🇦 South Africa',
        icon: '🎖️',
        stats: {
            'Test Runs': '13,289',
            'Test Wickets': '292',
            'Test Average': '55.37',
            'Catches': '200',
            'Centuries': '45'
        }
    },
    {
        name: 'Kumar Sangakkara',
        role: 'Wicket-keeper',
        country: '🇱🇰 Sri Lanka',
        icon: '📊',
        stats: {
            'Test Runs': '12,400',
            'ODI Runs': '14,234',
            'Test Average': '57.40',
            'Double Centuries': '11',
            'Dismissals': '678'
        }
    },
    {
        name: 'Sir Don Bradman',
        role: 'Batsman',
        country: '🇦🇺 Australia',
        icon: '👴',
        stats: {
            'Test Average': '99.94',
            'Test Runs': '6,996',
            'Centuries': '29',
            'Highest Score': '334',
            'Double Centuries': '12'
        }
    },
    {
        name: 'Wasim Akram',
        role: 'Bowler',
        country: '🇵🇰 Pakistan',
        icon: '⚡',
        stats: {
            'Test Wickets': '414',
            'ODI Wickets': '502',
            'Best Bowling': '7/119',
            'Hat-tricks': '4',
            'World Cup 1992': 'Winner'
        }
    }
];

function loadPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    playersGrid.innerHTML = cricketPlayers.map(player => `
        <div class="player-card">
            <div class="player-header">
                <div class="player-avatar">${player.icon}</div>
                <h3 class="player-name">${player.name}</h3>
                <p class="player-role">${player.role} • ${player.country}</p>
            </div>
            <ul class="player-stats">
                ${Object.entries(player.stats).map(([key, value]) => `
                    <li><span>${key}</span><span>${value}</span></li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

// ==================== TEAM RANKINGS ====================
const rankings = {
    test: [
        { rank: 1, team: '🇮🇳 India', rating: 121, points: 3098 },
        { rank: 2, team: '🇦🇺 Australia', rating: 119, points: 3876 },
        { rank: 3, team: '🇿🇦 South Africa', rating: 110, points: 2956 },
        { rank: 4, team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', rating: 108, points: 4167 },
        { rank: 5, team: '🇳🇿 New Zealand', rating: 106, points: 2745 }
    ],
    odi: [
        { rank: 1, team: '🇮🇳 India', rating: 117, points: 5860 },
        { rank: 2, team: '🇦🇺 Australia', rating: 116, points: 4540 },
        { rank: 3, team: '🇿🇦 South Africa', rating: 112, points: 4765 },
        { rank: 4, team: '🇳🇿 New Zealand', rating: 109, points: 4234 },
        { rank: 5, team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', rating: 107, points: 5345 }
    ],
    t20: [
        { rank: 1, team: '🇮🇳 India', rating: 266, points: 7980 },
        { rank: 2, team: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England', rating: 263, points: 6585 },
        { rank: 3, team: '🇵🇰 Pakistan', rating: 261, points: 7053 },
        { rank: 4, team: '🇦🇺 Australia', rating: 258, points: 6708 },
        { rank: 5, team: '🇿🇦 South Africa', rating: 256, points: 6400 }
    ]
};

function loadRankings() {
    loadRankingTable('test', rankings.test);
    loadRankingTable('odi', rankings.odi);
    loadRankingTable('t20', rankings.t20);
}

function loadRankingTable(format, data) {
    const tbody = document.getElementById(`${format}-rankings`);
    tbody.innerHTML = data.map(team => `
        <tr>
            <td><strong>${team.rank}</strong></td>
            <td>${team.team}</td>
            <td>${team.rating}</td>
            <td>${team.points}</td>
        </tr>
    `).join('');
}

// ==================== CRICKET HISTORY TIMELINE ====================
const historyEvents = [
    { year: 1744, title: 'First Laws of Cricket', desc: 'The first written laws of cricket were established in England.' },
    { year: 1877, title: 'First Test Match', desc: 'Australia vs England at Melbourne Cricket Ground - The birth of Test cricket.' },
    { year: 1909, title: 'Imperial Cricket Conference', desc: 'Formation of ICC (now International Cricket Council) with England, Australia, and South Africa.' },
    { year: 1971, title: 'First ODI Match', desc: 'Australia vs England at Melbourne - Birth of One Day International cricket.' },
    { year: 1975, title: 'First Cricket World Cup', desc: 'Inaugural Cricket World Cup won by West Indies in England.' },
    { year: 2003, title: 'T20 Cricket Introduction', desc: 'Twenty20 cricket format introduced in England.' },
    { year: 2007, title: 'First T20 World Cup', desc: 'India won the inaugural ICC T20 World Cup in South Africa.' },
    { year: 2008, title: 'IPL Launch', desc: 'Indian Premier League revolutionized cricket with franchise-based T20 tournament.' },
    { year: 2017, title: 'Day-Night Test Cricket', desc: 'Pink ball Test matches become more common worldwide.' },
    { year: 2021, title: 'WTC Final', desc: 'First World Test Championship Final won by New Zealand.' }
];

function loadHistory() {
    const timeline = document.getElementById('historyTimeline');
    timeline.innerHTML = historyEvents.map(event => `
        <div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-year">${event.year}</div>
                <h3 class="timeline-title">${event.title}</h3>
                <p class="timeline-desc">${event.desc}</p>
            </div>
        </div>
    `).join('');
}

// ==================== CRICKET RULES ====================
const rulesData = [
    {
        title: '🏏 Basic Rules',
        content: `Cricket is played between two teams of 11 players each. The batting team tries to score runs by hitting the ball and running between wickets, while the bowling team tries to dismiss batsmen and limit runs. A match consists of innings where each team gets a turn to bat and bowl.`
    },
    {
        title: '🎯 Ways of Getting Out',
        points: [
            'Bowled - Ball hits the stumps',
            'Caught - Fielder catches the ball',
            'LBW (Leg Before Wicket) - Ball would have hit stumps but hits batsman\'s leg',
            'Run Out - Batsman doesn\'t reach crease before stumps are broken',
            'Stumped - Wicket-keeper breaks stumps while batsman is out of crease',
            'Hit Wicket - Batsman accidentally hits own stumps'
        ]
    },
    {
        title: '📊 Scoring Runs',
        content: `Runs are scored by: Running between wickets (1-3 runs), hitting ball to boundary (4 runs), hitting ball over boundary without bouncing (6 runs). Extras include wides, no-balls, byes, and leg-byes.`
    },
    {
        title: '🏆 Match Formats',
        points: [
            '<strong>Test Cricket:</strong> 5 days, unlimited overs, two innings per team',
            '<strong>One Day International (ODI):</strong> 50 overs per side, one innings each',
            '<strong>Twenty20 (T20):</strong> 20 overs per side, one innings each',
            '<strong>T10:</strong> 10 overs per side, shortest format'
        ]
    },
    {
        title: '⚡ Powerplay Rules (Limited Overs)',
        content: `In ODI cricket, first 10 overs are mandatory powerplay (max 2 fielders outside 30-yard circle). In T20, first 6 overs are powerplay. These rules create exciting batting opportunities.`
    },
    {
        title: '🎪 DRS (Decision Review System)',
        content: `Teams can challenge umpire decisions using technology including ball-tracking (Hawk-Eye), edge detection (Hot Spot, Ultra Edge), and video replays. Each team gets limited reviews per innings.`
    }
];

function loadRules() {
    const rulesContent = document.getElementById('rulesContent');
    rulesContent.innerHTML = rulesData.map(rule => `
        <div class="rule-section">
            <h3>${rule.title}</h3>
            ${rule.content ? `<p>${rule.content}</p>` : ''}
            ${rule.points ? `<ul>${rule.points.map(point => `<li>${point}</li>`).join('')}</ul>` : ''}
        </div>
    `).join('');
}

// ==================== ICONIC MATCHES ====================
const iconicMatches = [
    {
        title: '🏆 1983 World Cup Final',
        date: 'June 25, 1983',
        venue: 'Lord\'s, London',
        teams: 'India vs West Indies',
        score: 'India 183 all out, West Indies 140 all out',
        description: 'India\'s historic first World Cup win against mighty West Indies changed cricket forever.'
    },
    {
        title: '🎯 Eden Gardens 2001',
        date: 'March 11-15, 2001',
        venue: 'Eden Gardens, Kolkata',
        teams: 'India vs Australia',
        score: 'India won by 171 runs after following on',
        description: 'VVS Laxman (281) and Rahul Dravid (180) created history with epic partnership.'
    },
    {
        title: '⚡ 438 Game',
        date: 'March 12, 2006',
        venue: 'Johannesburg',
        teams: 'South Africa vs Australia',
        score: 'Australia 434/4, South Africa 438/9',
        description: 'Highest successful ODI chase ever - South Africa chased down 434 runs.'
    },
    {
        title: '🏏 Tied Test',
        date: 'December 14-19, 1986',
        venue: 'Chennai',
        teams: 'India vs Australia',
        score: 'Both teams 347 runs',
        description: 'Only the second tied Test match in cricket history.'
    },
    {
        title: '🌟 2019 World Cup Final',
        date: 'July 14, 2019',
        venue: 'Lord\'s, London',
        teams: 'England vs New Zealand',
        score: 'Match tied, England won on boundary count',
        description: 'Most dramatic World Cup final ever with super over and controversial finish.'
    },
    {
        title: '💯 Desert Storm',
        date: 'April 22, 1998',
        venue: 'Sharjah',
        teams: 'India vs Australia',
        score: 'India 252/4, Australia 250/8',
        description: 'Sachin Tendulkar\'s legendary 143 in a sandstorm against Shane Warne.'
    }
];

function loadIconicMatches() {
    const matchesGrid = document.getElementById('iconicMatches');
    matchesGrid.innerHTML = iconicMatches.map(match => `
        <div class="match-card">
            <h3 class="match-title">${match.title}</h3>
            <div class="match-details">
                <p><strong>📅 Date:</strong> ${match.date}</p>
                <p><strong>🏟️ Venue:</strong> ${match.venue}</p>
                <p><strong>🏏 Teams:</strong> ${match.teams}</p>
                <div class="match-score">${match.score}</div>
                <p>${match.description}</p>
            </div>
        </div>
    `).join('');
}

// ==================== TOURNAMENTS ====================
const tournaments = [
    {
        name: '🏆 ICC Cricket World Cup',
        format: 'ODI',
        frequency: 'Every 4 years',
        firstEdition: '1975',
        mostWins: 'Australia (5 times)',
        description: 'The pinnacle of ODI cricket featuring top cricket nations.'
    },
    {
        name: '🏆 ICC T20 World Cup',
        format: 'T20',
        frequency: 'Every 2 years',
        firstEdition: '2007',
        mostWins: 'West Indies (2 times)',
        description: 'Global T20 championship showcasing explosive cricket.'
    },
    {
        name: '🏏 Indian Premier League (IPL)',
        format: 'T20',
        frequency: 'Annual',
        firstEdition: '2008',
        mostWins: 'Mumbai Indians (5 times)',
        description: 'World\'s richest cricket league with franchise-based teams.'
    },
    {
        name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 The Ashes',
        format: 'Test',
        frequency: 'Every 2 years',
        firstEdition: '1882',
        mostWins: 'Australia (33 series)',
        description: 'Historic rivalry between England and Australia in Test cricket.'
    },
    {
        name: '🏆 World Test Championship',
        format: 'Test',
        frequency: '2-year cycle',
        firstEdition: '2019-2021',
        mostWins: 'New Zealand (2021)',
        description: 'Championship to determine the best Test cricket nation.'
    },
    {
        name: '🏏 Big Bash League (BBL)',
        format: 'T20',
        frequency: 'Annual',
        firstEdition: '2011',
        mostWins: 'Perth Scorchers (5 times)',
        description: 'Australia\'s premier T20 franchise league.'
    }
];

function loadTournaments() {
    const tournamentsGrid = document.getElementById('tournamentsGrid');
    tournamentsGrid.innerHTML = tournaments.map(tournament => `
        <div class="tournament-card">
            <h3 class="tournament-title">${tournament.name}</h3>
            <div class="tournament-details">
                <p><strong>Format:</strong> ${tournament.format}</p>
                <p><strong>Frequency:</strong> ${tournament.frequency}</p>
                <p><strong>First Edition:</strong> ${tournament.firstEdition}</p>
                <p><strong>Most Wins:</strong> ${tournament.mostWins}</p>
                <p style="margin-top: 1rem;">${tournament.description}</p>
            </div>
        </div>
    `).join('');
}

// ==================== CRICKET FACTS ====================
const cricketFacts = [
    '🏏 Cricket is the 2nd most popular sport in the world with 2.5 billion fans.',
    '🌍 The longest cricket match lasted 14 days between England and South Africa in 1939.',
    '⚡ The fastest ball ever bowled was 161.3 km/h (100.2 mph) by Shoaib Akhtar.',
    '🎯 Don Bradman\'s Test average of 99.94 is considered the greatest achievement in any sport.',
    '🏆 Australia has won the Cricket World Cup 5 times, more than any other nation.',
    '💯 Sachin Tendulkar scored 100 international centuries (51 Test + 49 ODI).',
    '🎳 Muttiah Muralitharan took 800 Test wickets, the most by any bowler.',
    '🏏 The highest team total in Test cricket is 952/6 by Sri Lanka against India.',
    '⚡ AB de Villiers holds the record for fastest ODI century (31 balls).',
    '🌟 The first-ever international cricket match was played in 1844 between USA and Canada.',
    '🏆 West Indies dominated world cricket in the 1970s-80s, winning the first two World Cups.',
    '🎪 The largest cricket stadium is Narendra Modi Stadium in India with 132,000 capacity.',
    '🏏 A cricket ball can reach speeds over 160 km/h when bowled by fast bowlers.',
    '💎 The most expensive cricket bat was sold for $83,000 - used by Mahendra Singh Dhoni.',
    '🌍 Cricket was played at the Olympics only once in 1900 (Great Britain won gold).',
    '⚡ Yuvraj Singh hit 6 sixes in an over against England in the 2007 T20 World Cup.',
    '🏆 India has never lost a Test series at home to Australia since 2004.',
    '🎯 The first Cricket World Cup in 1975 featured matches with 60 overs per side.',
    '🏏 Pakistan\'s Shahid Afridi holds the record for fastest ODI fifty (16 balls).',
    '🌟 The term "Ashes" originated when England lost to Australia in 1882 and a mock obituary was published.'
];

function loadFacts() {
    const factsContainer = document.getElementById('factsContainer');
    factsContainer.innerHTML = cricketFacts.map(fact => `
        <div class="fact-card">
            <p class="fact-text">${fact}</p>
        </div>
    `).join('');
}

// ==================== LIVE SCORE SIMULATOR ====================
let matchInterval;
let matchRunning = false;
let team1 = { runs: 0, wickets: 0, overs: 0, balls: 0 };
let team2 = { runs: 0, wickets: 0, overs: 0, balls: 0 };
let currentTeam = team1;
let currentTeamName = 'India';
let commentary = [];

function initLiveScore() {
    document.getElementById('startMatch').addEventListener('click', startMatch);
    document.getElementById('pauseMatch').addEventListener('click', pauseMatch);
    document.getElementById('resetMatch').addEventListener('click', resetMatch);
}

function startMatch() {
    if (matchRunning) return;

    matchRunning = true;
    document.getElementById('startMatch').disabled = true;
    document.getElementById('pauseMatch').disabled = false;

    matchInterval = setInterval(simulateBall, 1500);
}

function pauseMatch() {
    matchRunning = false;
    clearInterval(matchInterval);
    document.getElementById('startMatch').disabled = false;
    document.getElementById('pauseMatch').disabled = true;
}

function resetMatch() {
    pauseMatch();
    team1 = { runs: 0, wickets: 0, overs: 0, balls: 0 };
    team2 = { runs: 0, wickets: 0, overs: 0, balls: 0 };
    currentTeam = team1;
    currentTeamName = 'India';
    commentary = [];
    updateScoreDisplay();
    document.getElementById('commentary').innerHTML = '<p>Match not started yet. Click "Start Match" to begin!</p>';
}

function simulateBall() {
    if (currentTeam.wickets >= 10) {
        switchInnings();
        return;
    }

    if (currentTeam.overs >= 20) {
        switchInnings();
        return;
    }

    // Simulate ball outcome
    const outcomes = [0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 6, 'W'];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    let commentText = '';

    if (outcome === 'W') {
        currentTeam.wickets++;
        commentText = `🔴 WICKET! ${currentTeamName} ${currentTeam.runs}/${currentTeam.wickets} (${currentTeam.overs}.${currentTeam.balls})`;
    } else {
        currentTeam.runs += outcome;
        if (outcome === 6) {
            commentText = `🎯 SIX! ${currentTeamName} ${currentTeam.runs}/${currentTeam.wickets} (${currentTeam.overs}.${currentTeam.balls})`;
        } else if (outcome === 4) {
            commentText = `🏏 FOUR! ${currentTeamName} ${currentTeam.runs}/${currentTeam.wickets} (${currentTeam.overs}.${currentTeam.balls})`;
        } else {
            commentText = `${outcome} run${outcome !== 1 ? 's' : ''}. ${currentTeamName} ${currentTeam.runs}/${currentTeam.wickets} (${currentTeam.overs}.${currentTeam.balls})`;
        }
    }

    currentTeam.balls++;
    if (currentTeam.balls >= 6) {
        currentTeam.balls = 0;
        currentTeam.overs++;
    }

    commentary.unshift(commentText);
    if (commentary.length > 10) commentary.pop();

    updateScoreDisplay();
    updateCommentary();
}

function switchInnings() {
    if (currentTeam === team1) {
        currentTeam = team2;
        currentTeamName = 'Australia';
        addCommentary(`🔄 End of first innings! Australia needs ${team1.runs + 1} to win.`);
    } else {
        endMatch();
    }
}

function endMatch() {
    pauseMatch();
    let result = '';
    if (team1.runs > team2.runs) {
        result = `🏆 India wins by ${team1.runs - team2.runs} runs!`;
    } else if (team2.runs > team1.runs) {
        result = `🏆 Australia wins by ${10 - team2.wickets} wickets!`;
    } else {
        result = `🤝 Match Tied!`;
    }
    addCommentary(result);
}

function updateScoreDisplay() {
    document.getElementById('team1-runs').textContent = team1.runs;
    document.getElementById('team1-wickets').textContent = team1.wickets;
    document.getElementById('team1-overs').textContent = `${team1.overs}.${team1.balls}`;

    document.getElementById('team2-runs').textContent = team2.runs;
    document.getElementById('team2-wickets').textContent = team2.wickets;
    document.getElementById('team2-overs').textContent = `${team2.overs}.${team2.balls}`;
}

function updateCommentary() {
    const commentaryDiv = document.getElementById('commentary');
    commentaryDiv.innerHTML = commentary.map(c => `<p>${c}</p>`).join('');
}

function addCommentary(text) {
    commentary.unshift(text);
    if (commentary.length > 10) commentary.pop();
    updateCommentary();
}
