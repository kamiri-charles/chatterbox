import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface ChatProps {
	username: string,
}

const Chat: React.FC<ChatProps> = ({username}) => {
	const [users, setUsers] = useState([]);


	useEffect(() => {

		console.log(username); // Username not logged

		const socket = io("http://localhost:3001");

		socket.on("connect", () => {
			socket.emit("new_user", {
				id: socket.id,
				username: username, // Username not sent
			});
		});


        socket.on("users", (data) => {
            setUsers(data.users);
        })

		return () => {
			socket.disconnect();
		};
	}, [username]);

	return (
		<div className="chat">
			<Navbar users={users} username={username} />
			<ChatBox unique_id={""} />
		</div>
	);
};

export default Chat;
