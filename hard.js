let board = Array(9).fill('');
let gameOver = false;
let playerTurn = true;
let playerSymbol = 'X';
let computerSymbol = 'O';

let playerScore = parseInt(localStorage.getItem('hardPlayerScore')) || 0;
let computerScore = parseInt(localStorage.getItem('hardComputerScore')) || 0;

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

// Computer makes move
function computerMove() {
  if (gameOver) return;

  let move;
  if (Math.random() < 0.95) move = findBestMove(); // 95% optimal
  else move = getRandomMove();                     // 5% random

  board[move] = computerSymbol;
  playerTurn = true;
  updateBoard();
  checkWinner();
}

function findBestMove() {
  let candidates = [];

  // 1. Winning moves
  let winMove = getAllWinningMoves(computerSymbol);
  if (winMove.length) return randomChoice(winMove);

  // 2. Blocking moves
  let blockMove = getAllWinningMoves(playerSymbol);
  if (blockMove.length) return randomChoice(blockMove);

  // 3. Center
  if (board[4] === '') return 4;

  // 4. Corners
  let corners = [0, 2, 6, 8].filter(i => board[i] === '');
  if (corners.length) return randomChoice(corners);

  // 5. Sides
  let sides = [1, 3, 5, 7].filter(i => board[i] === '');
  if (sides.length) return randomChoice(sides);

  // 6. Fallback
  let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  return randomChoice(empty);
}

// Get all possible winning moves for a symbol
function getAllWinningMoves(symbol) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  let moves = [];
  winCombos.forEach(combo => {
    const [a,b,c] = combo;
    let values = [board[a], board[b], board[c]];
    if (values.filter(v => v===symbol).length===2 && values.includes('')) {
      moves.push(combo[values.indexOf('')]);
    }
  });
  return moves;
}

// Pick random element from array
function randomChoice(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function getRandomMove() {
  let empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
  return randomChoice(empty);
}

function updateBoard() {
  boardDiv.childNodes.forEach((cellDiv, idx) => cellDiv.textContent = board[idx]);
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

  localStorage.setItem('hardPlayerScore', playerScore);
  localStorage.setItem('hardComputerScore', computerScore);

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
  [playerSymbol, computerSymbol] = [computerSymbol, playerSymbol]; // alternate
  playerTurn = (playerSymbol === 'X');
  createBoard();
  status.textContent = playerTurn ? "Your Turn" : "Computer's Turn";
  if (!playerTurn) setTimeout(computerMove, 300);
}

createBoard();
status.textContent = playerTurn ? "Your Turn" : "Computer's Turn";
if (!playerTurn) setTimeout(computerMove, 300);
