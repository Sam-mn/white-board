import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { FaUserAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import socket from "../modules/socket-clint";

const ChatSection = ({ setMessages, setMessage, message, messages }) => {
    const { name } = useParams();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });
        return () => {
            socket.off("message");
        };
    }, [messages, setMessages]);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit("sendMessage", message, () => setMessage(""));
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    return (
        <MainDiv>
            <ChatDiv>
                {messages?.map((m, i) => {
                    if (m.user === name) {
                        return (
                            <FirstDiv key={i}>
                                <FaUserAlt />
                                <UserMsg>
                                    <MessageP>{m.text}</MessageP>
                                </UserMsg>
                            </FirstDiv>
                        );
                    } else if (m.user === "admin") {
                        return (
                            <AdminDiv key={i}>
                                <AdminMessage>
                                    <MessageP>{m.text}</MessageP>
                                </AdminMessage>
                            </AdminDiv>
                        );
                    } else {
                        return (
                            <SecondDiv key={i}>
                                <OthersMsg>
                                    <UserNameP>{m.user}:</UserNameP>
                                    <MessageP>{m.text}</MessageP>
                                </OthersMsg>
                                <FaUserAlt />
                            </SecondDiv>
                        );
                    }
                })}
                <div ref={messagesEndRef} />
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
    bottom: 16%;
    border: 1px solid black;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    padding-bottom: 0.3rem;
    margin-left: 1rem;
    justify-content: space-between;
    background-color: #ececec;
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
    margin-right: 0.2rem;
    margin-bottom: 0.4rem;
    justify-content: flex-end;
`;

const UserNameP = styled.p`
    margin: 0;
    margin-left: 0.5rem;
    font-size: 0.7rem;
    text-align: left;
    overflow-wrap: break-word;
`;
const MessageP = styled.p`
    margin: 0;
    margin-left: 0.5rem;
    text-align: left;
    overflow-wrap: break-word;
`;

const UserMsg = styled.div`
    width: 80%;
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
    width: 80%;
    background-color: #d2d2d2;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
    padding: 0.2rem;
    padding-right: 0.5rem;
    margin-right: 0.5rem;
`;

const Form = styled.form``;

const Input = styled.input`
    width: 96%;
    padding: 0.3rem;
    border-radius: 0.3rem;
    border: none;
    &:focus {
        outline: none;
    }
`;

const ChatDiv = styled.div`
    height: 90%;
    overflow: scroll;
`;

const AdminDiv = styled.div`
    width: 90%;
    background-color: #d1ecf1;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
    padding: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    font-size: 0.6rem;
    margin-bottom: 0.5rem;
`;

const AdminMessage = styled.div`
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
    padding: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
`;
