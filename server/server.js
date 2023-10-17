const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..'));
app.use(express.static(path.join(__dirname, '..')));

app.get("/", (req, res) => {
    res.render("home/index")
});

app.get("/PcGame", (req, res) => {
    res.render("AI/index");
});

app.get("/room", (req, res) => {
    res.render("HM/index");
});

let newPlayerSymbol = "X";
let currentPlayer = "X";
let reloadFlag = false;

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", () => {
        if(!reloadFlag){
            reloadFlag = true;
            io.emit("reload");
        }
        console.log(`User joined to room`);
        socket.emit("startGame", { symbol: newPlayerSymbol, current: currentPlayer });
        newPlayerSymbol = newPlayerSymbol === "X" ? "O" : "X";

        console.log(`Game started in room`);
    });

    socket.on("makeMove", ({ squareIndex, symbol }) => {
        if(reloadFlag) reloadFlag = false;
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        io.emit("moveMade", { squareIndex, symbol, current: currentPlayer });
        console.log(`Move made in the room`);
    });

    socket.on("gameEnded", ({ winner }) => {
        io.emit("gameEnded", { winner });
        console.log(`Game ended, Winner: ${winner}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});