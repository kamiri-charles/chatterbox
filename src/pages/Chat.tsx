import Welcome from "../components/Welcome";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { MessageType } from "../custom_types";

interface ChatProps {
	username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
	const [socket, setSocket] = useState<Socket>();
	const [connected, setConnected] = useState<boolean>(false);
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [receiverId, setReceiverId] = useState<string>("");

	useEffect(() => {
		const newSocket = io("http://localhost:3001");
		setSocket(newSocket);

		newSocket.on("connect", () => {
			newSocket.emit("new_user", {
				id: newSocket.id,
				username: username,
			});
		});

		newSocket.on("users", (data) => {
			setUsers(data.users);
		});

		newSocket.on("new_message", (data) => {
			setMessages(data.messages);
		});

		return () => {
			newSocket.disconnect();
		};
	}, [username]);

	return (
		<div className="chat">
			{connected ? (
				<ChatBox messages={messages} />
			) : (
				<Welcome
					users={users}
					socket={socket}
					loading={loading}
					setLoading={setLoading}
					receiverId={receiverId}
					setReceiverId={setReceiverId}
					setConnected={setConnected}
				/>
			)}
		</div>
	);
};

export default Chat;
