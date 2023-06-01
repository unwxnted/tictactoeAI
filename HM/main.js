const squares = document.querySelectorAll('.square');
const socket = io();

let board = ['', '', '', '', '', '', '', '', ''];

let mySymbol = '';
let currentPlayer = 'X';

document.addEventListener("DOMContentLoaded", () => {
    squares.forEach((square) => {
        square.addEventListener('click', handleClick);
    });

    socket.on("connect", () => {
        console.log("Connected to server");
    });

    socket.on("startGame", ({ symbol }) => {
        console.log("Game started");
        mySymbol = symbol;
    });

    socket.on("moveMade", ({ squareIndex, symbol }) => {
        makeMove(squareIndex, symbol);
        if(currentPlayer === "X") currentPlayer = "O";
        if(currentPlayer === "O") currentPlayer = "X";
    });

    socket.on("gameEnded", ({ winner }) => {
        console.log(`Game over. Winner: ${winner}`);
    });

    function handleClick(event) {
        const square = event.target;
        const squareIndex = square.id;

        if (currentPlayer === mySymbol && board[squareIndex] === '') {
            socket.emit("makeMove", { room: "gameRoom", squareIndex, symbol: currentPlayer });
        }
    }

    function makeMove(squareIndex, symbol) {
        const square = squares[squareIndex];
        square.classList.add(symbol);
        square.innerHTML = symbol;
        board[squareIndex] = symbol;

        if (isGameOver()) {
            checkGameOver();
        }
    }

    socket.emit("joinRoom", "gameRoom");
    socket.emit("startGame", "gameRoom");
});

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

function isGameOver() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    if (!board.includes('')) {
        return true;
    }

    return false;
}

function checkGameOver() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            squares[a].classList.add('winning');
            squares[b].classList.add('winning');
            squares[c].classList.add('winning');
            socket.emit("gameEnded", { room: "gameRoom", winner: board[a] });
            alert(`${board[a]} wins!`);
            return;
        }
    }

    if (!board.includes('')) {
        socket.emit("gameEnded", { room: "gameRoom", winner: "nobody" });
        alert('Tie game!');
    }
}
