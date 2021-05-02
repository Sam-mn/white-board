import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { FaComments, FaUsers } from "react-icons/fa";
import ChatSection from "./ChatSection";
import socket from "../modules/socket-clint";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import OnlineUsersSection from "./OnlineUsersSection";
import { db } from "../firebase/index";

const WhiteBoard = () => {
    const canvasRef = useRef();
    const [isDrawing, setIsDrawing] = useState(true);
    const [color, setColor] = useState("black");
    const [lineSize, setLineSize] = useState(1);
    const [openChat, setOpenChat] = useState(false);
    const [openOnlineUsers, setOpenOnlineUsers] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const { roomName } = useParams();
    const navigate = useNavigate();

    const drawOnCanvas = function () {
        const canvas = document.querySelector("#board");
        const ctx = canvas.getContext("2d");
        const sketch = document.querySelector("#sketch");
        const sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue("width"));
        canvas.height = parseInt(sketch_style.getPropertyValue("height"));
        const mouse = { x: 0, y: 0 };
        const last_mouse = { x: 0, y: 0 };
        /* Mouse Capturing Work */
        canvas.addEventListener(
            "mousemove",
            function (e) {
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;

                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;
            },
            false
        );
        /* Drawing on Paint App */
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "blue";

        canvas.addEventListener(
            "mousedown",
            function (e) {
                canvas.addEventListener("mousemove", onPaint, false);
            },
            false
        );

        canvas.addEventListener(
            "mouseup",
            function () {
                canvas.removeEventListener("mousemove", onPaint, false);
            },
            false
        );

        let root = {};
        const onPaint = function () {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            if (root.timeout !== undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function () {
                const data = canvas.toDataURL("image/png");
                socket.emit("canvas-data", { data, room: roomName });
            }, 1000);
        };
    };

    useEffect(() => {
        drawOnCanvas();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = color;
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.lineWidth = lineSize;
    }, [lineSize]);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    useEffect(() => {
        socket.on("canvas-data", (data) => {
            let image = new Image();
            const canvas = document.querySelector("#board");
            const context = canvas.getContext("2d");
            image.onload = () => {
                context.drawImage(image, 0, 0);
            };
            image.src = data;
        });
    }, [isDrawing]);

    useEffect(() => {
        socket.on("updated-waiting-list", (data) => {
            console.log("Got updated waiting list from server:", data);
        });
    }, []);

    const handleChangeColor = (e) => {
        setColor(e.target.value);
    };

    const handleOnChange = (e) => {
        setLineSize(e.target.value);
    };

    const handleOpenChat = () => {
        setOpenChat(!openChat);
        setOpenOnlineUsers(false);
    };

    const handleOnLeave = () => {
        console.log("leave");
        socket.emit("disconnect");
        // navigate("/");
    };

    const handleOnlineUsers = () => {
        setOpenOnlineUsers(!openOnlineUsers);
        setOpenChat(false);
        socket.emit("getUsers", { room: roomName }, (data) => {
            setUsers(data);
        });
    };

    return (
        <MainDiv>
            <ColorsDiv className='colors'>
                <SizeDiv>
                    <select name='size' id='size' onChange={handleOnChange}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                    </select>
                </SizeDiv>
                <input type='color' onChange={handleChangeColor} />
                <Button onClick={handleOnLeave}>Leave</Button>
            </ColorsDiv>
            <div className='sketch' id='sketch'>
                <canvas
                    // onMouseDown={startDraw}
                    // onMouseUp={stopDraw}
                    // onMouseMove={drawing}
                    ref={canvasRef}
                    id='board'
                />
            </div>
            {openChat && (
                <ChatSection
                    setMessages={setMessages}
                    setMessage={setMessage}
                    message={message}
                    messages={messages}
                />
            )}

            {openOnlineUsers && <OnlineUsersSection users={users} />}
            <FlexDiv>
                <IconDiv onClick={handleOpenChat}>
                    <FaComments style={{ width: "2.5rem", height: "2.5rem" }} />
                </IconDiv>
                <UsersIconDiv onClick={() => handleOnlineUsers()}>
                    <FaUsers style={{ width: "2.5rem", height: "2.5rem" }} />
                </UsersIconDiv>
            </FlexDiv>
        </MainDiv>
    );
};

export default WhiteBoard;

const MainDiv = styled.div`
    position: relative;
`;

const ColorsDiv = styled.div`
    padding: 0.5rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #565555;
    position: absolute;
`;

const SizeDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5rem;
`;

const IconDiv = styled.div``;

const UsersIconDiv = styled.div`
    margin-left: 1rem;
`;

const FlexDiv = styled.div`
    display: flex;
    position: absolute;
    bottom: 3rem;
    left: 1rem;
    cursor: pointer;
`;
