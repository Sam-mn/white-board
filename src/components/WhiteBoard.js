import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { FaComments, FaUsers } from "react-icons/fa";
import ChatSection from "./ChatSection";
import socket from "../modules/socket-clint";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import OnlineUsersSection from "./OnlineUsersSection";

const WhiteBoard = () => {
    const canvasRef = useRef();
    const contextRef = useRef();
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black");
    const [lineSize, setLineSize] = useState(1);
    const [openChat, setOpenChat] = useState(false);
    const [openOnlineUsers, setOpenOnlineUsers] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const { roomName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `100%`;
        canvas.style.height = `100%`;
        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        contextRef.current = context;
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

    const startDraw = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const stopDraw = (e) => {
        setIsDrawing(false);
        contextRef.current.closePath();
    };

    const drawing = (e) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = e.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        const data = canvasRef.current.toDataURL(("image/jpeg", 0.5));
        socket.emit("canvas-data", { data, room: roomName });
        console.log(data);
    };

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
        socket.emit("disconnect");
        navigate("/");
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
            <canvas
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={drawing}
                ref={canvasRef}
                id='board'
            />
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
