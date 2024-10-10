import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import { useEffect } from "react";
import { io } from "socket.io-client";

const Chat: React.FC = () => {

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on("connect", () => {
            console.log("Connected to the server");
        });

		socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();
        };
}, []);
    
    return (
        <div className="chat">
            <Navbar />
            <ChatBox />
        </div>
    )
}

export default Chat;