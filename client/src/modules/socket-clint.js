import socketIOClient from "socket.io-client";

const endpoint = "http://localhost:8000/";
// const endpoint = "https://a-digital-whiteboard.herokuapp.com/";

const socket = socketIOClient(endpoint);

export default socket;
