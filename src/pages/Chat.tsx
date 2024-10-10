import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface ChatProps {
	username: string,
}

const Chat: React.FC<ChatProps> = ({username}) => {
    const [userCount, setUserCount] = useState<number>(0);
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

        socket.on("user_count", (data) => {
            setUserCount(data.count);
        })

        socket.on("users", (data) => {
            setUsers(data.users);
        })

		return () => {
			socket.disconnect();
		};
	}, [username]);

	return (
		<div className="chat">
			<Navbar user_count={userCount} users={users} />
			<ChatBox unique_id={""} />
		</div>
	);
};

export default Chat;
