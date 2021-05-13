const { addUser, removeUser, getUser, getUserInRoom } = require("./users");
const { db } = require("./firebase/index");

const userName = (data) => {
    console.log(data);
};

let rooms = [];

const users = {};

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

    // join room
    socket.on("join", ({ name, roomName }, callback) => {
        const user = addUser({
            id: socket.id,
            name,
            room: roomName,
        });

        if (user.error) return callback("error");

        // send message when user joining it
        socket.emit("message", {
            user: "admin",
            text: `Hello ${user.name} Welcome to the room ${user.room}`,
        });
        // send message when a new user joining it
        socket.broadcast.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has joined`,
        });

        socket.join(user.room);

        // check if the room is exist
        const existingRoom = rooms.find((room) => room.name === user.room);

        if (!existingRoom) {
            rooms.push({ name: user.room, users: {} });
        }

        // update rooms
        io.emit("updated-rooms", {
            rooms,
        });

        // get online users
        io.to(user.room).emit("getOnlineUser", { users: getUserInRoom() });

        // save a new room to the db
        db.collection("rooms")
            .doc(user.room)
            .get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    return;
                }

                db.collection("rooms").doc(user.room).set({
                    name,
                    drawing: "",
                });
            });

        callback({
            joinChat: true,
            usernameInUse: false,
            onlineUsers: getUserInRoom(user.room),
        });
    });

    // send message
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });
        callback();
    });

    io.emit("roomList", { rooms });

    // get the users in the room
    socket.on("getUsers", (data, callback) => {
        const users = getUserInRoom(data.room);
        if (!users.length > 0) {
            db.collection("rooms").doc(data.room).delete();
        }
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

    // send canvas data to the users
    socket.on("canvas-data", (data) => {
        db.collection("rooms").doc(data.room).update({ drawing: data.data });
        socket.broadcast.to(data.room).emit("canvas-data", data.data);
    });

    // leave the room and check if there are users, if not delete the room and the room data from db
    socket.on("leave-room", (data) => {
        console.log(
            `User with socketId ${socket.id} wants to leave ${data.room}`
        );
        const user = removeUser(socket.id);
        io.emit("roomList", { rooms });
        if (user) {
            socket.to(user.room).emit("message", {
                user: "admin",
                text: `${user.name} has left`,
            });
        }
    });

    // delete room
    socket.on("delete-room", (data) => {
        const updatedRooms = rooms.filter((d) => d.name !== data.room);
        rooms = updatedRooms;
        io.emit("roomList", { rooms });
    });

    // get the canvas data from db for the new users
    socket.on("get-existing-data", (data, callback) => {
        db.collection("rooms")
            .doc(data.room)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().drawing) {
                    callback({ data: doc.data().drawing });
                } else {
                    console.log("doc not exist");
                }
            });
    });
};
