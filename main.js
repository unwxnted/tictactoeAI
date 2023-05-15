
const squares = document.querySelectorAll('.square');

let board = ['', '', '', '', '', '', '', '', ''];


let playerSymbol = 'X';
let currentPlayer = 'X';

let aiSymbol = 'O';


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

function isGameOver(board) {

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }


  if (board.includes('')) {
    return false;
  }

  return true;
}


function getBestMove(board, depth, maximizingPlayer) {

  if (isGameOver(board)) {

    if (!board.includes('')) {
      return 0;
    }

    if (maximizingPlayer) {
      return 1;
    }

    return -1;
  }


  if (maximizingPlayer) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = aiSymbol;
        let score = getBestMove(board, depth + 1, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (depth === 0) {
      squares[bestMove].classList.add('ai');
      board[bestMove] = aiSymbol;
    }

    return bestScore;
  }

  else {
    let bestScore = Infinity;
    let bestMove = null;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = playerSymbol;
        let score = getBestMove(board, depth + 1, true);
        board[i] = '';
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (depth === 0) {
      squares[bestMove].classList.add('player');
      board[bestMove] = playerSymbol;
    }

    return bestScore;
  }
}

squares.forEach((square) => {
  square.addEventListener("click", handleClick);
});

function handleClick(event) {
  const square = event.target;
  const squareIndex = square.id;
  let gameOver = isGameOver(squareIndex);

  if (board[squareIndex] || gameOver) {
    return;
  }

  board[squareIndex] = currentPlayer;
  square.classList.add(currentPlayer);
  square.innerHTML = currentPlayer;

  if (checkGameOver()) {
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    //makeComputerMoveMinMax();
    setTimeout(() => {
      squares[makeComputerMoveTEST1()].click();
    }, 500);
  }
}


function makeComputerMoveTEST1() {

  let tBoard = board.slice();
  for (let i = 0; i < board.length; i++) {
    if (board[i] == '') {
      tBoard[i] = 'O';
      if (isGameOver(tBoard)) {
        return i;
      } else {
        tBoard[i] = '';
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] == '') {
      tBoard[i] = 'X';
      if (isGameOver(tBoard)) {
        return i;
      } else {
        tBoard[i] = '';
      }
    }
  }

  if (board[4] == '') {
    return 4;
  }

  if(board[4] == 'O') {

    for(let i = 0; i < board.length; i++) {
      if (i == 1 || i == 3 || i == 5 || i == 7) {
        if (board[i] == '') {
          return i;
        }
      }
    }

  }else{
    for (let i = 0; i < board.length; i++) {
      if (i == 0 || i == 2 || i == 6 || i == 8) {
        if (board[i] == '') {
          return i;
        }
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] == "") {
      return i;
    }
  }

  return -1;
}

function checkGameOver() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      squares[a].classList.add("winning");
      squares[b].classList.add("winning");
      squares[c].classList.add("winning");

      alert(`${board[a]} wins!`);
      return true;
    }
  }

  if (!board.includes("")) {
    alert("Tie game!");
    return true;
  }

  return false;
}

function getBestMoveIndex() {
  let bestScore = -Infinity;
  let bestMoveIndex;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = getBestMove(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMoveIndex = i;
      }
    }
  }

  return bestMoveIndex;
}

function makeComputerMoveMinMax() {
  const bestMoveIndex = getBestMoveIndex();
  const bestMoveSquare = squares[bestMoveIndex];
  setTimeout(() => {
    bestMoveSquare.click();
  }, 500);
}
