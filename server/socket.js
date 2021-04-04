const debug = require("debug")("whiteboard:socket");

const userName = (data) => {
    console.log(data);
};

module.exports = function (socket) {
    // this = io
    io = this;
    console.log(`Client ${socket.id} connected!`);

    socket.on("user-name", userName);

    socket.on("join", (data) => {
        console.log(data);
    });

    socket.on("chat message", (data) => {
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} had left`);
    });
};
