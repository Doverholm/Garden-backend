const express = require("express");
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');
const { initGameServer } = require('./gameServer.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://zimplyzudoku.com/",
        methods: ["GET", "POST"]
    }
});
app.use(cors());

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log('server started and is listening to port: ', port);
});

initGameServer(io);