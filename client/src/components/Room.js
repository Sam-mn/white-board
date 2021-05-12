import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputGroup, Button, FormControl, Alert } from "react-bootstrap";
import styled from "styled-components";
import socket from "../modules/socket-clint";

const Room = () => {
    const [roomName, setRoomName] = useState("");
    const [roomList, setRoomList] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { name } = useParams();

    const handleOnChange = (e) => {
        setError(null);
        setRoomName(e.target.value);
    };

    useEffect(() => {
        socket.on("roomList", (data) => {
            setRoomList(data.rooms);
        });

        return () => {
            socket.off("roomList");
        };
    }, [roomList]);

    useEffect(() => {
        socket.on("updated-rooms", (data) => {
            setRoomList(data.rooms);
        });

        return () => {
            socket.emit("disconnect");
            socket.off("updated-rooms");
        };
    }, [roomList]);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (!roomName) {
            setError("Chose a room name to continue");
            return;
        }

        socket.emit("join", { name, roomName }, (data) => {
            // setRoomList(data);
            // console.log(data);
        });

        navigate(`/whiteboard/${name}/${roomName}`);
    };

    const handleJoinRoom = (e, roomName) => {
        socket.emit("join", { name, roomName }, (data) => {
            // setRoomList(data);
            // console.log("join", data);
        });
        navigate(`/whiteboard/${name}/${roomName}`);
    };

    return (
        <Wrapper>
            <H1>Rooms</H1>
            <Form onSubmit={handleOnSubmit}>
                <InputGroup className='mb-3'>
                    <FormControl
                        placeholder='create a new room'
                        aria-label='create a new room'
                        aria-describedby='basic-addon2'
                        onChange={handleOnChange}
                        required
                    />
                    <InputGroup.Append>
                        <Button variant='outline-primary' type='submit'>
                            Create
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
                {error && <P>{error}</P>}
            </Form>
            {roomList.length > 0 ? (
                <Ul>
                    {roomList.map((room, i) => {
                        return (
                            <Li key={i}>
                                <span>{room.name}</span>
                                <Button
                                    variant='success'
                                    onClick={(e) =>
                                        handleJoinRoom(e, room.name)
                                    }
                                >
                                    Join
                                </Button>
                            </Li>
                        );
                    })}
                </Ul>
            ) : (
                <StyledAlert variant='info'>
                    There are no rooms yet!
                </StyledAlert>
            )}
        </Wrapper>
    );
};

export default Room;

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
    margin: 0 auto;
    align-self: center;
    @media (min-width: 800px) {
        width: 50%;
    }
`;

const Ul = styled.ul`
    list-style: none;
    margin: 0 auto;
    margin-top: 3rem;
    color: #fff;
    padding-left: 0;
    width: 70%;
`;

const Li = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid;
    align-items: center;
`;

const StyledAlert = styled(Alert)`
    margin: 0 auto;
    @media (min-width: 800px) {
        width: 30%;
    }
`;

// const Input = styled.input`
//     width: 100%;
//     &:focus {
//         outline: none;
//     }
// `;

// const Button = styled.button`
//     margin-top: 1rem;
//     border-radius: 0.25rem;
//     color: #fff;
//     background-color: #007bff;
//     border: 1px solid #007bff;
//     padding: 0.4rem;
//     &:hover {
//         background-color: #0069d9;
//         border-color: #0062cc;
//     }
// `;
