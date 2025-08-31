// ======== Medium Mode Logic ========

let board = Array(9).fill('');
let gameOver = false;
let playerTurn = true;
let playerSymbol = 'X';
let computerSymbol = 'O';

// Load scores from localStorage for medium mode
let playerScore = parseInt(localStorage.getItem('mediumPlayerScore')) || 0;
let computerScore = parseInt(localStorage.getItem('mediumComputerScore')) || 0;

const boardDiv = document.getElementById('board');
const status = document.getElementById('status');
const playerScoreSpan = document.getElementById('playerScore');
const computerScoreSpan = document.getElementById('computerScore');

function createBoard() {
  boardDiv.innerHTML = '';
  board.forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handlePlayerClick(idx));
    boardDiv.appendChild(cellDiv);
  });
  updateScoreboard();
}

function handlePlayerClick(idx) {
  if (gameOver || board[idx] !== '' || !playerTurn) return;
  board[idx] = playerSymbol;
  playerTurn = false;
  updateBoard();
  checkWinner();
  if (!gameOver) setTimeout(computerMove, 300);
}

function computerMove() {
  if (gameOver) return;

  let move;
  let rand = Math.random();
  if (rand < 0.6) {
    // 60% chance computer plays smart
    move = findWinningMove(computerSymbol) !== -1 ? findWinningMove(computerSymbol) :
           findWinningMove(playerSymbol) !== -1 ? findWinningMove(playerSymbol) :
           getRandomMove();
  } else {
    // 40% chance computer plays random (player may win)
    move = getRandomMove();
  }

  board[move] = computerSymbol;
  playerTurn = true;
  updateBoard();
  checkWinner();
}

function getRandomMove() {
  const empty = board.map((v,i) => v === '' ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function findWinningMove(symbol) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of winCombos) {
    const [a,b,c] = combo;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === symbol).length === 2 &&
        values.includes('')) {
      return combo[values.indexOf('')];
    }
  }
  return -1;
}

function updateBoard() {
  boardDiv.childNodes.forEach((cellDiv, idx) => {
    cellDiv.textContent = board[idx];
  });
}

function checkWinner() {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of winCombos) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      declareWinner(board[a]);
      return;
    }
  }
  if (!board.includes('')) declareWinner('draw');
}

function declareWinner(winner) {
  gameOver = true;
  if (winner === playerSymbol) playerScore++;
  else if (winner === computerSymbol) computerScore++;

  localStorage.setItem('mediumPlayerScore', playerScore);
  localStorage.setItem('mediumComputerScore', computerScore);

  alert(
    winner === playerSymbol ? "You Win!" :
    winner === computerSymbol ? "Computer Wins!" : "It's a Draw!"
  );
  updateScoreboard();
}

function updateScoreboard() {
  playerScoreSpan.textContent = `You: ${playerScore}`;
  computerScoreSpan.textContent = `Computer: ${computerScore}`;
}

function newGame() {
  board = Array(9).fill('');
  gameOver = false;
  [playerSymbol, computerSymbol] = [computerSymbol, playerSymbol];
  playerTurn = playerSymbol === 'X';
  createBoard();
  status.textContent = playerTurn ? "Your Turn" : "Computer's Turn";
  if (!playerTurn) setTimeout(computerMove, 300);
}

// Initialize
createBoard();
status.textContent = playerTurn ? "Your Turn" : "Computer's Turn";
