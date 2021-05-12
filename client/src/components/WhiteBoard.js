import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { FaComments, FaUsers, FaEraser } from "react-icons/fa";
import ChatSection from "./ChatSection";
import socket from "../modules/socket-clint";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import OnlineUsersSection from "./OnlineUsersSection";

const WhiteBoard = () => {
    const canvasRef = useRef();
    const [color, setColor] = useState("black");
    const [lineSize, setLineSize] = useState(1);
    const [openChat, setOpenChat] = useState(false);
    const [openOnlineUsers, setOpenOnlineUsers] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const { roomName, name } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = document.querySelector("#board");
        //if the element is undefined return;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const sketch = document.querySelector("#sketch");
        const sketch_style = getComputedStyle(sketch);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const mouse = { x: 0, y: 0 };
        const last_mouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener(
            "mousemove",
            function (e) {
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;
                mouse.x = e.pageX - canvas.offsetLeft;
                mouse.y = e.pageY - canvas.offsetTop;
            },
            false
        );

        canvas.addEventListener(
            "touchmove",
            function (e) {
                const touch = e.touches[0];
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;
                mouse.x = touch.pageX;
                mouse.y = touch.pageY;
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

        canvas.addEventListener(
            "touchstart",
            function () {
                canvas.addEventListener("touchmove", onPaint, false);
            },
            false
        );

        canvas.addEventListener(
            "touchend",
            function () {
                canvas.removeEventListener("touchmove", onPaint, false);
            },
            false
        );

        let root = {};

        const onPaint = function (e) {
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
    }, [roomName]);

    useEffect(() => {
        socket.emit("get-existing-data", { room: roomName }, (data) => {
            if (!data) return;
            let image = new Image();
            const canvas = document.querySelector("#board");
            const context = canvas.getContext("2d");
            image.onload = () => {
                context.drawImage(image, 0, 0);
            };
            image.src = data.data;
        });
    }, [roomName]);

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
    }, []);

    useEffect(() => {
        socket.on("updated-waiting-list", (data) => {});
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
        navigate(`/room/${name}`);
    };

    const handleOnlineUsers = () => {
        setOpenOnlineUsers(!openOnlineUsers);
        setOpenChat(false);
        socket.emit("getUsers", { room: roomName }, (data) => {
            setUsers(data);
        });
    };

    useEffect(() => {
        return () => {
            socket.emit("leave-room", { room: roomName });
            socket.emit("getUsers", { room: roomName }, (data) => {
                if (!data.users.length > 0) {
                    socket.emit("delete-room", { room: roomName });
                }
            });
            socket.off("canvas-data");
            socket.off("updated-waiting-list");
            socket.off("message");
            socket.off("canvas-data");
        };
    }, [roomName]);

    return (
        <MainDiv>
            <StyledLeaveButton variant='danger' onClick={handleOnLeave}>
                Leave
            </StyledLeaveButton>
            <ColorsDiv className='colors'>
                <StyledEraser
                    onClick={() => {
                        setColor("#fff");
                    }}
                />
                <input type='color' onChange={handleChangeColor} />
                <SizeDiv>
                    <select name='size' id='size' onChange={handleOnChange}>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                        <option value='7'>7</option>
                        <option value='8'>8</option>
                    </select>
                </SizeDiv>
            </ColorsDiv>
            <div className='sketch' id='sketch'>
                <canvas ref={canvasRef} id='board' />
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
    cursor: crosshair;
`;

const ColorsDiv = styled.div`
    padding: 0.5rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    /* background-color: #e8e8e8; */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    /* border: 1px solid #696969;
    border-top: none;
    border-radius: 0 0 0.6rem 0.6rem; */
    height: 2.5rem;
    margin-top: 0.5rem;
`;

const SizeDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0.5rem;
`;

const IconDiv = styled.div``;

const UsersIconDiv = styled.div`
    margin-left: 1rem;
`;

const FlexDiv = styled.div`
    display: flex;
    position: absolute;
    bottom: 8%;
    left: 1rem;
    cursor: pointer;
`;

const StyledLeaveButton = styled(Button)`
    position: absolute;
    right: 1%;
    top: 1.2%;
`;

const StyledEraser = styled(FaEraser)`
    cursor: pointer;
    width: 3rem;
    height: 3rem;
    margin-right: 0.5rem;
    @media (min-width: 768px) {
        width: 2.5rem;
        height: 2.5rem;
    }
    @media (min-width: 992px) {
        width: 2rem;
        height: 2rem;
    }
`;
