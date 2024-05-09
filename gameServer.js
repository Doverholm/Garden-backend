const randomIntFromInterval = require('./utils/util-functions.js');

const players = {};

const initGameServer = (io) => {
    io.on('connection', (socket) => {

        const playerId = socket.id;
    
        socket.on('enter-world', (data) => {
            console.log('client want to enter world');
    
            players[playerId] = {
                playerId: playerId,
                pos: {
                    x: randomIntFromInterval(0, data.windowWidth),
                    y: randomIntFromInterval(0, data.windowHeight),
                },
                size: {
                    x: 50,
                    y: 50
                },
                color: {
                    r: randomIntFromInterval(0, 256),
                    g: randomIntFromInterval(0, 256),
                    b: randomIntFromInterval(0, 256)
                }
            }
            io.emit('playersObject', players);
    
        });

        socket.on('requestRedraw', () => io.emit('playersObject', players));
    
        socket.on('move', (data) => {
            players[data.id].pos.x += data.x;
            players[data.id].pos.y += data.y;
            io.emit('playersObject', players);
        })
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
            delete players[playerId];
            console.log(players);
            io.emit('playersObject', players);
        });
    
    });
}

module.exports = { initGameServer };

