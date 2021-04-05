import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import socket from "../modules/socket-clint";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";

const ChatSection = ({ setMessages, setMessage, message, messages }) => {
    const { name, roomName } = useParams();

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit("sendMessage", message, () => setMessage(""));
        }
    };

    return (
        <MainDiv>
            <ChatDiv>
                {messages?.map((m, i) => {
                    if (m.user === name) {
                        return (
                            <FirstDiv key={i}>
                                <FaUserAlt />
                                <UserMsg>
                                    <UserP>{m.user}</UserP>
                                    <UserP>{m.text}</UserP>
                                </UserMsg>
                            </FirstDiv>
                        );
                    } else {
                        return (
                            <SecondDiv key={i}>
                                <FaUserAlt />
                                <OthersMsg>
                                    <OtherP>{m.user}</OtherP>
                                    <OtherP>{m.text}</OtherP>
                                </OthersMsg>
                            </SecondDiv>
                        );
                    }
                })}
            </ChatDiv>
            <Form onSubmit={handleOnSubmit}>
                <Input
                    type='text'
                    value={message ? message : ""}
                    required
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Write some thing...'
                />
            </Form>
        </MainDiv>
    );
};

export default ChatSection;

const MainDiv = styled.div`
    position: absolute;
    height: 23rem;
    width: 16rem;
    bottom: 6rem;
    border: 1px solid black;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    padding-bottom: 0.3rem;
    margin-left: 1rem;
    justify-content: space-between;
`;

const FirstDiv = styled.div`
    align-self: flex-start;
    display: flex;
    align-items: center;
    margin-left: 0.2rem;
    margin-bottom: 0.4rem;
`;

const SecondDiv = styled.div`
    align-self: flex-start;
    display: flex;
    align-items: center;
    margin-left: 0.2rem;
    margin-bottom: 0.4rem;
`;

const UserP = styled.p`
    margin: 0;
    margin-left: 0.5rem;
`;
const OtherP = styled.p`
    margin: 0;
    margin-left: 0.5rem;
`;

const UserMsg = styled.div`
    min-width: 10rem;
    background-color: #5555ff;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
    padding: 0.2rem;
    padding-left: 0.5rem;
    color: #fff;
    margin-left: 0.5rem;
`;

const OthersMsg = styled.div`
    min-width: 10rem;
    background-color: #d2d2d2;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
    padding: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
`;

const Form = styled.form``;

const Input = styled.input`
    width: 90%;
    padding: 0.3rem;
`;

const ChatDiv = styled.div`
    height: 90%;
    overflow: scroll;
`;
