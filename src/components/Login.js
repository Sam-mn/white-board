import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import socket from "../modules/socket-clint";

const Login = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setError(null);
        setName(e.target.value);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            console.log("Write your name to continue");
            setError("Write your name to continue");
            return;
        }
        socket.emit("user-name", { name });
        navigate(`/room/${name}`);
    };

    return (
        <Wrapper>
            <H1>Digital whiteboard</H1>
            <Form onSubmit={handleOnSubmit}>
                <Label> Write your name here</Label>
                <Input type='text' onChange={handleOnChange} />
                {error && <P>{error}</P>}
                <Button type='submit'>Submit</Button>
            </Form>
        </Wrapper>
    );
};

export default Login;

const P = styled.p`
    width: 50%;
    margin: 0 auto;
    text-align: center;
    background-color: #fff3cd;
    border-color: #ffeeba;
    color: #856404;
`;

const H1 = styled.h1`
    color: #fff;
    text-align: center;
    padding-top: 3rem;
`;

const Label = styled.label`
    color: #fff;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background-color: #333;
`;

const Form = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
    margin: 0 auto;
    align-self: center;
    margin-top: 8rem;
`;

const Input = styled.input`
    width: 100%;
    &:focus {
        outline: none;
    }
`;

const Button = styled.button`
    margin-top: 1rem;
    border-radius: 0.25rem;
    color: #fff;
    background-color: #007bff;
    border: 1px solid #007bff;
    padding: 0.4rem;
    &:hover {
        background-color: #0069d9;
        border-color: #0062cc;
    }
`;