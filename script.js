let player1 = '';
let player2 = '';
let player1Symbol = '';
let player2Symbol = '';
let player1Color = '';
let player2Color = '';
let player1Score = 0;
let player2Score = 0;
let currentPlayer = '';
let boardState = Array(9).fill('');
let gameOver = false;
let firstPlayer = ''; // keep track who starts each game

// Get mode from URL or default
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'easy'; // easy, medium, hard

// Load saved scores for this mode
let playerScore = parseInt(localStorage.getItem(`${mode}-playerScore`)) || 0;
let computerScore = parseInt(localStorage.getItem(`${mode}-computerScore`)) || 0;

// Update scoreboard UI
updateScoreboard();




// Start the game
function startGame() {
  player1 = document.getElementById('player1Name').value || 'Player 1';
  player2 = document.getElementById('player2Name').value || 'Player 2';
  player1Color = document.getElementById('player1Color').value;
  player2Color = document.getElementById('player2Color').value;

  // Randomize symbols for first game
  if (!firstPlayer) {
    if (Math.random() < 0.5) {
      firstPlayer = player1;
      player1Symbol = 'X';
      player2Symbol = 'O';
    } else {
      firstPlayer = player2;
      player2Symbol = 'X';
      player1Symbol = 'O';
    }
  }

  currentPlayer = firstPlayer;

  document.getElementById('playerSetup').style.display = 'none';
  document.getElementById('scoreboard').style.display = 'block';
  document.getElementById('newBtn').style.display = 'inline-block';
  updateScoreboard();
  createBoard();
  updateTurnIndicator();
}

// Create the 3x3 board
function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  boardState = Array(9).fill('');
  gameOver = false;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handleCellClick(i));
    board.appendChild(cell);
  }
}

// Handle a cell click
function handleCellClick(index) {
  if (boardState[index] !== '' || gameOver) return;

  const symbol = currentPlayer === player1 ? player1Symbol : player2Symbol;
  const color = currentPlayer === player1 ? player1Color : player2Color;

  boardState[index] = symbol;
  const cell = document.getElementsByClassName('cell')[index];
  cell.textContent = symbol;
  cell.style.color = color;

  const winCombo = checkWinner(symbol);
  if (winCombo) {
    gameOver = true;
    highlightWin(winCombo);
    declareWinner(symbol);
  } else if (!boardState.includes('')) {
    gameOver = true;
    alert("It's a draw!");
  } else {
    switchPlayer();
    updateTurnIndicator();
  }
}

// Switch turns
function switchPlayer() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;
}

// Update turn indicator
function updateTurnIndicator() {
  document.getElementById('status').textContent = `${currentPlayer}'s turn`;
}

// Check for winner
function checkWinner(symbol) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winCombos.find(combo => combo.every(index => boardState[index] === symbol)) || null;
}

// Highlight winning cells
function highlightWin(combo) {
  combo.forEach(index => {
    const cell = document.getElementsByClassName('cell')[index];
    cell.classList.add('win');
  });
}

// Update scoreboard
function updateScoreboard() {
  document.getElementById('player1Score').textContent = `${player1}: ${player1Score}`;
  document.getElementById('player2Score').textContent = `${player2}: ${player2Score}`;
}

// Declare winner
function declareWinner(symbol) {
  if (symbol === player1Symbol) {
    player1Score++;
    alert(`${player1} wins!`);
  } else {
    player2Score++;
    alert(`${player2} wins!`);
  }
  updateScoreboard();
}

// New Game
function newGame() {
  // Alternate first player
  firstPlayer = firstPlayer === player1 ? player2 : player1;

  // Randomize X/O for new game
  if (Math.random() < 0.5) {
    player1Symbol = 'X';
    player2Symbol = 'O';
  } else {
    player1Symbol = 'O';
    player2Symbol = 'X';
  }

  currentPlayer = firstPlayer;
  boardState = Array(9).fill('');
  gameOver = false;
  createBoard();
  updateTurnIndicator();
}

// Back to Main Menu
function backToMenu() {
  window.location.href = 'index.html';
}
