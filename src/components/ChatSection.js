import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import socket from "../modules/socket-clint";

const ChatSection = () => {
    const [value, setValue] = useState("");
    const { roomName } = useParams();

    useEffect(() => {
        console.log(roomName);
    }, []);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        socket.emit("chat message", value);
        setValue("");
    };

    return (
        <MainDiv>
            <ChatDiv>
                <FirstDiv>
                    <FaUserAlt />
                    <UserMsg>
                        <UserP>samer</UserP>
                        <UserP>Hi</UserP>
                    </UserMsg>
                </FirstDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
                <SecondDiv>
                    <FaUserAlt />
                    <OthersMsg>
                        <OtherP>moe</OtherP>
                        <OtherP>Hello</OtherP>
                    </OthersMsg>
                </SecondDiv>
            </ChatDiv>
            <Form onSubmit={handleOnSubmit}>
                <Input
                    type='text'
                    value={value ? value : ""}
                    onChange={(e) => setValue(e.target.value)}
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
