import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WhiteBoard from "./components/WhiteBoard";
import Login from "./components/Login";
import Room from "./components/Room";
import socket from "./modules/socket-clint";

function App() {
    useEffect(() => {
        socket.on("connection", (data) => {
            console.log("connected to socket server" + data);
        });

        return () => {
            console.log("Will disconnect from socket-server now...");
            socket.removeAllListeners();
            socket.disconnect();
            socket.off();
        };
    }, []);

    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route path='/'>
                        <Login />
                    </Route>
                    <Route path='/room/:name'>
                        <Room />
                    </Route>
                    <Route path='/Whiteboard/:name/:roomName'>
                        <WhiteBoard />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
