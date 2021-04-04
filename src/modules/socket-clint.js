import socketIOClient from "socket.io-client";

const endpoint = "http://localhost:8000/";

const socket = socketIOClient(endpoint);

export default socket;
