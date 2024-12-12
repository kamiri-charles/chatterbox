import { useState, useEffect } from "react";
import Welcome from "../components/Welcome";
import ChatBox from "../components/ChatBox";
import { Socket, io } from "socket.io-client";
import ServersList from "../components/ServersList";

interface ChatProps {
	username: string;
}

const Landing: React.FC<ChatProps> = ({ username }) => {
	const [socket, setSocket] = useState<Socket>();
	const [randomChatFound, setRandomChatFound] = useState<boolean>(false);
	const [users, setUsers] = useState([]);
	const [roomId, setRoomId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [randomBuddyUsername, setRandomBuddyUsername] = useState<string>("");
	const [serversDisplay, setServersDisplay] = useState(false);

	useEffect(() => {
		// Development
		// const newSocket = io("http://localhost:3001");

		// Production
		const newSocket = io("https://chatterbox-server-4f094ffa6ffe.herokuapp.com/");
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

	const get_comp = () => {
		if (!serversDisplay) {
			if (randomChatFound) {
				return <ChatBox
					socket={socket}
					roomId={roomId}
					username={username}
					randomBuddyUsername={randomBuddyUsername}
					setRandomChatFound={setRandomChatFound}
				/>;
			} else {
				return <Welcome
					users={users}
					socket={socket}
					loading={loading}
					setLoading={setLoading}
					setRandomChatFound={setRandomChatFound}
					setRoomId={setRoomId}
					setRandomBuddyUsername={setRandomBuddyUsername}
					setServersDisplay={setServersDisplay}
				/>;
			}
		} else {
			return <ServersList setServersDisplay={setServersDisplay} />;
		}
	}

	
	return (
		<div className="chat">{get_comp()}</div>
		
	);
};

export default Landing;

{
	/* <div className="chat">
			{randomChatFound ? (
				<ChatBox
					socket={socket}
					roomId={roomId}
					username={username}
					randomBuddyUsername={randomBuddyUsername}
					setRandomChatFound={setRandomChatFound}
				/>
			) : (
				<Welcome
					users={users}
					socket={socket}
					loading={loading}
					setLoading={setLoading}
					setRandomChatFound={setRandomChatFound}
					setRoomId={setRoomId}
					setRandomBuddyUsername={setRandomBuddyUsername}
				/>
			)}
		</div> */
}