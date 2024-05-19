const randomIntFromInterval = require('./utils/util-functions.js');

const GameObject = require("./GameObject.js");
const Player = require('./Player.js');

const players = {};

const gameState = {
    gameObjects: {
        1: new GameObject({
            id: "gameObject1",
            pos: {
                x: 600,
                y: 400
            },
            sprite: {
                name: "OBJECT-demo",
                type: "image",
                animate: false
            }
        }),
        2: new GameObject({
            id: "gameObject2",
            pos: {
                x: 100,
                y: 300
            }
        })
    },
    players: {},
    map: {
        name: "MAP-garden"
    }
}

const imageMetaData2 = new Map([
    ["BODY-skeleton", "/BODY-skeleton.png"],
    ["OBJECT-demo", "/OBJECT-demo.png"],
    ["MAP-garden", "/MAP-garden.png"]
]);

const initGameServer = (io) => {

    io.on('connection', (socket) => {
        const imageMetaDataArray = Array.from(imageMetaData2.entries());
        socket.emit('imageMetaData', imageMetaDataArray);

        const playerId = socket.id;
        console.log("player connected: ", playerId);
    
        gameState.players[playerId] = new Player({
            id: playerId,
            pos: {
                x: 1200,
                y: 500
            },
            sprite: {
                name: "BODY-skeleton",
                type: "sheet",
                animation: {
                    animating: false,
                    totalSteps: 9,
                    totalFacings: 4,
                    currentStep: 0,
                    currentFacing: 2,
                    size: 64
                }
            }
        });

        socket.on('keysInput', (inputs) => {
            gameState.players[playerId].inputs = inputs;
        });

        socket.on('disconnect', () => {
            console.log("player disconnected: ", playerId);
            delete gameState.players[playerId];
            io.emit('updateGameState', JSON.stringify(gameState));
        });

        io.emit('updateGameState', JSON.stringify(gameState));
    });

    setInterval( () => {
        updateGameState();
        io.emit('updateGameState', JSON.stringify(gameState));
    }, 1000 / 30);

}

const updateGameState = () => {
    Object.values(gameState.players).forEach(player => player.updatePosition());
}

module.exports = { initGameServer };

