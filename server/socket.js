const debug = require("debug")("whiteboard:socket");
const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

const userName = (data) => {
    console.log(data);
};

const rooms = [
    {
        name: "test1",
        users: {},
    },
    {
        name: "test2",
        users: {},
    },
];

const users = {};

/**
 * Get room names
 */
function getListOfRoomNames() {
    return rooms.map((room) => room.name);
}

/**
 * Get room by user id
 */
function getRoomByUserId(id) {
    return rooms.find((room) => room.users.hasOwnProperty(id));
}

/**
 * Handle a request for rooms
 */
function handleGetRoomList(callback) {
    callback(getListOfRoomNames());
}

module.exports = function (socket) {
    // this = io
    io = this;
    console.log(`Client ${socket.id} connected!`);

    socket.on(
        "user-name",
        (userName,
        () => {
            io.emit("roomList", { rooms });
        })
    );

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

        const existingRoom = rooms.find((room) => room.name === user.room);

        if (!existingRoom) {
            rooms.push({ name: user.room, users: {} });
        }

        // send the updated waiting list to all other users in the room
        socket.broadcast.to(user.room).emit("updated-waiting-list", {
            users: getUserInRoom(user.room),
        });

        // send the updated waiting list to all other users in the room
        io.emit("updated-rooms", {
            rooms,
        });

        io.to(user.room).emit("getOnlineUser", { users: getUserInRoom() });

        callback({
            joinChat: true,
            usernameInUse: false,
            onlineUsers: getUserInRoom(user.room),
        });
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });
        callback();
    });

    io.emit("roomList", { rooms });

    socket.on("getUsers", (data, callback) => {
        console.log(data);
        callback({ users: getUserInRoom(data.room) });
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

    socket.on("canvas-data", (data) => {
        socket.broadcast.to(data.room).emit("canvas-data", data.data);
    });

    socket.on("leave-room", (data) => {
        console.log(
            `User with socketId ${socket.id} wants to leave ${data.room}`
        );

        const user = removeUser(socket.id);

        if (user) {
            socket.to(user.room).emit("message", {
                user: "admin",
                text: `${user.name} has left`,
            });
        }
    });
};
