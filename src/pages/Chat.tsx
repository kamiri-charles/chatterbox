import Welcome from "../components/Welcome";
import ChatBox from "../components/ChatBox";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

interface ChatProps {
	username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
	const [socket, setSocket] = useState<Socket>();
	const [connected, setConnected] = useState<boolean>(false);
	const [users, setUsers] = useState([]);
	const [roomId, setRoomId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

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

		return () => {
			newSocket.disconnect();
		};
	}, [username]);

	return (
		<div className="chat">
			{connected ? (
				<ChatBox
					socket={socket}
					roomId={roomId}
					username={username}
				/>
			) : (
				<Welcome
					users={users}
					socket={socket}
					loading={loading}
					setLoading={setLoading}
					setConnected={setConnected}
					setRoomId={setRoomId}
				/>
			)}
		</div>
	);
};

export default Chat;
