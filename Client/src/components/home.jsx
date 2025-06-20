import React from "react";
import Nav from "./nav/nav";
//The home page 
export default function Home() {
    const { currentUser, setCurrentUser } = useCurrentUser();
    return (
        <>
            <Nav />
            <h1>Welcome: {currentUser.name}</h1>
        </>
    );
}