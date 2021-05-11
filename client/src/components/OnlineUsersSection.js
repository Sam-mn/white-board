import React from "react";
import styled from "styled-components";
import { FaUserAlt } from "react-icons/fa";

const OnlineUsersSection = ({ users }) => {
    console.log(users.users);
    return (
        <MainDiv>
            <Ul>
                {users.users?.map((u) => {
                    console.log(u);
                    return (
                        <Li key={u.id}>
                            <FaUserAlt style={{ color: "green" }} />
                            <Span> {u.name.toUpperCase()}</Span>
                        </Li>
                    );
                })}
            </Ul>
        </MainDiv>
    );
};

export default OnlineUsersSection;

const MainDiv = styled.div`
    position: absolute;
    height: 23rem;
    width: 16rem;
    bottom: 6rem;
    border: 1px solid black;
    border-radius: 0.5rem;
    padding-top: 1rem;
    padding-bottom: 0.3rem;
    margin-left: 1rem;
`;

const Ul = styled.ul`
    list-style: none;
    padding-left: 0.8rem;
`;

const Li = styled.li`
    text-align: left;
    margin-bottom: 0.5rem;
`;

const Span = styled.span`
    margin-left: 1rem;
`;
