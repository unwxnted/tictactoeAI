const squares = document.querySelectorAll('.square');

let board = ['', '', '', '', '', '', '', '', ''];

let playerSymbol = 'X';
let currentPlayer = 'X';
let aiSymbol = 'O';

const button = document.createElement('button');
button.innerHTML = "RESTART";
button.addEventListener('click', resetGame);
const resetContainer = document.getElementById('reset-container');
resetContainer.appendChild(button);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function resetGame(){
  board = ['', '', '', '', '', '', '', '', ''];
  playerSymbol = 'X';
  currentPlayer = 'X';
  aiSymbol = 'O';
  squares.forEach((square) => {
    square.classList.remove('X', 'O', 'winning');
    square.innerHTML = '';
  });
}

function isGameOver(board) {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.includes('')) {
    return null;
  }

  return 'Tie';
}

function getBestMove(board, depth, alpha, beta, maximizingPlayer) {
  const winner = isGameOver(board);

  if (winner) {
    if (winner === aiSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (winner === 'Tie') return 0;
  }

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = aiSymbol;
        let score = getBestMove(board, depth + 1, alpha, beta, false);
        board[i] = '';

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }

        alpha = Math.max(alpha, bestScore);
        if (alpha >= beta) {
          break;
        }
      }
    }

    if (depth === 0) return bestMove;

    return bestScore;
  } else {
    let bestScore = Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = playerSymbol;
        let score = getBestMove(board, depth + 1, alpha, beta, true);
        board[i] = '';

        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }

        beta = Math.min(beta, bestScore);
        if (alpha >= beta) {
          break;
        }
      }
    }

    return bestScore;
  }
}


squares.forEach((square) => {
  square.addEventListener('click', handleClick);
});

function handleClick(event) {
  const square = event.target;
  const squareIndex = square.id;
  let gameOver = isGameOver(board);

  if (board[squareIndex] || gameOver) {
    return;
  }

  board[squareIndex] = currentPlayer;
  square.classList.add(currentPlayer);
  square.innerHTML = currentPlayer;

  if(isGameOver(board)) {
    checkGameOver();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (currentPlayer === 'O') {
    makeComputerMoveMinMax();
  }

  if(isGameOver(board)) {
    checkGameOver();
  }
}



function checkGameOver() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      squares[a].classList.add('winning');
      squares[b].classList.add('winning');
      squares[c].classList.add('winning');

      alert(`${board[a]} wins!`);
      return true;
    }
  }

  if (!board.includes('')) {
    alert('Tie game!');
    return true;
  }

  return false;
}

function checkWinnableMove(board) {

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      if (isGameOver(board)) {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      if (isGameOver(board)) {
        board[i] = '';
        return i;
      }
      board[i] = '';
    }
  }

  return -1;
}

function makeComputerMoveMinMax() {
  const bestMoveIndex = getBestMove(board, 0, -Infinity, Infinity, true);
  const bestMoveSquare = squares[bestMoveIndex];
  board[bestMoveIndex] = aiSymbol;
  bestMoveSquare.classList.add(aiSymbol);
  bestMoveSquare.innerHTML = aiSymbol;

  if(isGameOver(board)) {
    return;
  }

  currentPlayer = playerSymbol;
}