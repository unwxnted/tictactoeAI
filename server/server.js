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

let currentSymbol = "X";
let playersInRoom = 0;

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
        playersInRoom++;
    
        if (playersInRoom === 2) {
            if(currentSymbol === "X") currentSymbol = "O";
            if(currentSymbol === "O") currentSymbol = "X";
            io.to(room).emit("startGame", { symbol: currentSymbol });
            console.log(`Game started in room ${room}`);
        }
    });

    socket.on("startGame", (room) => {
        currentSymbol = currentSymbol === "X" ? "O": "X";
        io.to(room).emit("startGame", { symbol:  currentSymbol});
        console.log(`Game started in room ${room}`);
    });

    socket.on("makeMove", ({ room, squareIndex, symbol }) => {
        io.to(room).emit("moveMade", { squareIndex, symbol });
        console.log(`Move made in room ${room}`);
    });

    socket.on("gameEnded", ({ room, winner }) => {
        io.to(room).emit("gameEnded", { winner });
        console.log(`Game ended in room ${room}. Winner: ${winner}`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(server.PORT, () => {
    console.log(`Server on port ${server.PORT}`);
});