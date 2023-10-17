# TicTacToe Game Hub

AI Game Hub is a real-time gaming application that allows users to play the "Tic-Tac-Toe" game online. The application uses Express.js and Socket.io to enable real-time interaction between players.

## Setup and Usage

### Installing Dependencies

Make sure you have Node.js installed on your system. Then, you can install the required dependencies by running the following command:

```
npm install
```

### Running the Application
You can run the application using the following command:

```
node server/server.js
```

The application will run on port 3000 by default. You can access it in your web browser by visiting http://localhost:3000.

## Code Structure
The application's code is divided into two main parts: the server and the client.

### Server (server/server.js)
The server uses Express.js to handle routes and Socket.io to enable real-time communication between players. Here, you'll find the core server code, including Express configuration, route handling, and game logic.

### Client (Views and Frontend)
The frontend of the application is based on the EJS template engine and is located in the views that are rendered at specific routes. Users can access the homepage at /, play the game at /PcGame, and join a room at /room.

### Real-Time Communication
The application allows players to join a room and play "Tic-Tac-Toe" in real time. When a user joins a room, they are assigned a symbol (X or O) and the game begins. Moves are reflected instantly on other players' screens, keeping the game in sync.

## Main Dependencies
EJS - Template engine

Express - Node.js web application framework

Socket.io - Real-time communication library

## License
This project is licensed under the ISC License.
