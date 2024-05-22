
const GameObject = require("./GameObject.js");

const imageMetaData = new Map([
    ["BODY-skeleton", "/BODY_skeletonX1.75.png"],
    ["OBJECT-demo", "/OBJECT-demo.png"],
    ["MAP-garden", "/garden_mapX2.png"]
]);

let gameState = null;
const players = new Map();
const objects = new Map();
objects.set(1, new GameObject({
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
}));
objects.set(2, new GameObject({
    id: "gameObject2",
    pos: {
        x: 100,
        y: 300
    }
}));


const initGameServer = (io) => {

    io.on('connection', (socket) => {
        console.log("player connected: ", socket.id);

        socket.on('reqImages', () => {
            const imageMetaDataArray = Array.from(imageMetaData.entries());
            socket.emit('resImages', imageMetaDataArray);
        });

        socket.on('newPlayer', (player) => {
            players.set(player.id, player);
            console.log(players);

            const playersArray = Array.from(players.entries());
            const objectsArray = Array.from(objects.entries());
            gameState = {
                players: playersArray,
                objects: objectsArray,
                map: "MAP-garden"
            };
            if (players.get(player.id)) {
                socket.emit('newPlayerInitialized');
                io.emit('playerJoined', player);
            } else {
                socket.emit('newPlayerInitFailed');
            }

        });

        socket.on('reqGameState', () => {
            if (gameState) {
                socket.emit('resGameState', gameState);
            } else {
                socket.emit('initGameStateFailed');
            }
        });
        
        socket.on('newPlayerState', (newState) => {
            io.emit('newPlayerState', newState);
        });

        socket.on('disconnect', () => {
            console.log("player disconnected: ", socket.id);
            players.delete(socket.id);
            //boradcast the deleted player
            io.emit('playerDisconnected', socket.id);
        });
    });

}
module.exports = { initGameServer };

