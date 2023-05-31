const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
server.PORT = 3003;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..'));
app.use(express.static(path.join(__dirname, '..')));

app.get("/PcGame", (req, res) => {
    res.render("AI/index");
});

app.get("/room", (req, res) => {
    res.render("HM/index");
});

let currentSymbol = "O";

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("startGame", (room) => {
        currentSymbol = currentSymbol === "X" ? "O": "X";
        io.to(room).emit("gameStarted", { symbol:  currentSymbol});
        console.log(`Game started in room ${room}`);
    });

    socket.on("makeMove", ({ room, squareIndex, symbol }) => {
        io.to(room).emit("moveMade", { squareIndex, symbol });
        console.log(`Move made in room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(server.PORT, () => {
    console.log(`Server on port ${server.PORT}`);
});