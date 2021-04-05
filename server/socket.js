const debug = require("debug")("whiteboard:socket");
const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

const userName = (data) => {
    console.log(data);
};

function handleJoinRoom({ name, roomName }, callback) {
    const user = addUser({
        id: this.id,
        name,
        room: roomName,
    });

    if (user.error) return callback("error");

    this.emit("message", {
        user: "admin",
        text: `${user.name} Welcome to the room ${user.room}`,
    });

    this.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has joined`,
    });

    this.join(user.roomName);

    callback();
}

function handleSendMessage(message, callback) {
    const user = getUser(this.id);
    console.log(user, message);

    this.to(user.room).emit("message", { user: user.name, text: message });
    callback();
}

module.exports = function (socket) {
    // this = io
    io = this;
    console.log(`Client ${socket.id} connected!`);

    socket.on("user-name", userName);

    socket.on("join", ({ name, roomName }, callback) => {
        const user = addUser({
            id: socket.id,
            name,
            room: roomName,
        });

        if (user.error) return callback("error");

        socket.emit("message", {
            user: "admin",
            text: `Hello ${user.name} Welcome to the room ${user.room}`,
        });

        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has joined`,
        });

        socket.join(user.room);

        socket
            .to(user.name)
            .emit("roomData", {
                room: user.room,
                users: getUserInRoom(user.room),
            });

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUserInRoom(user.room),
        });

        callback();
    });

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} had left`);
        const user = removeUser(socket.id);
        if (user) {
            socket.to(user.room).emit("message", {
                user: "admin",
                text: `${user.name} has left`,
            });
        }
    });
};
