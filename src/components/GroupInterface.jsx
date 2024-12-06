import React from "react";
import { useNavigate } from "react-router-dom";
import GroupChat from "./GroupChat.jsx";
import Navigation from "./Navigation.jsx";

const GroupInterface = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navigation />
            <GroupChat />
        </div>
    );
};

export default GroupInterface;
