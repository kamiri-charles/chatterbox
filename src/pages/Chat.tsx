import Welcome from "../components/Welcome";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MessageType } from "../custom_types";

interface ChatProps {
	username: string,
}

const Chat: React.FC<ChatProps> = ({username}) => {
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState<MessageType[]>([]);


	useEffect(() => {
		const socket = io("http://localhost:3001");

		socket.on("connect", () => {
			socket.emit("new_user", {
				id: socket.id,
				username: username,
			});
		});

        socket.on("users", (data) => {
            setUsers(data.users);
        });

		socket.on("new_message", (data) => {
			setMessages(data.messages);
		});

		return () => {
			socket.disconnect();
		};
	}, [username]);


	return (
		<div className="chat">
			<Welcome users={users} />
			{/* <ChatBox messages={messages} /> */}
		</div>
	);
};

export default Chat;
