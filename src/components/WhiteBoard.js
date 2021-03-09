import React, { useRef, useState, useEffect } from "react";

const WhiteBoard = () => {
    const canvasRef = useRef();
    const contextRef = useRef();
    const [isDrawing, setIsDrawing] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [color, setColor] = useState("black");
    const [lineSize, setLineSize] = useState(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        contextRef.current = context;
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
        const data = canvasRef.current.toDataURL("image/png");
    };

    return (
        <div>
            <canvas
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={drawing}
                ref={canvasRef}
                id='board'
            />
        </div>
    );
};

export default WhiteBoard;
