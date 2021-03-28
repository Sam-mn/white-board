import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { FaComments } from "react-icons/fa";
import ChatSection from "./ChatSection";

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

const IconDiv = styled.div`
    position: absolute;
    bottom: 3rem;
    left: 1rem;
    cursor: pointer;
`;

const WhiteBoard = () => {
    const canvasRef = useRef();
    const contextRef = useRef();
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black");
    const [lineSize, setLineSize] = useState(1);
    const [openChat, setOpenChat] = useState(false);

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
        const data = canvasRef.current.toDataURL("image/png");
    };

    const handleChangeColor = (e) => {
        setColor(e.target.value);
    };

    const handleOnChange = (e) => {
        setLineSize(e.target.value);
    };

    const handleOpenChat = () => {
        setOpenChat(!openChat);
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
            </ColorsDiv>
            <canvas
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={drawing}
                ref={canvasRef}
                id='board'
            />
            {openChat && <ChatSection />}
            <IconDiv onClick={handleOpenChat}>
                <FaComments style={{ width: "2.5rem", height: "2.5rem" }} />
            </IconDiv>
        </MainDiv>
    );
};

export default WhiteBoard;
