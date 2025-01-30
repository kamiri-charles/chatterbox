import { useState, useEffect } from "react";
import Welcome from "../components/Welcome";
import ChatBox from "../components/ChatBox";
import { Socket } from "socket.io-client";

interface LandingProps {
	socket: Socket | undefined;
	username: string;
}


const Landing: React.FC<LandingProps> = ({ socket, username }) => {
	const [randomChatFound, setRandomChatFound] = useState<boolean>(false);
	const [users, setUsers] = useState([]);
	const [roomId, setRoomId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [randomBuddyUsername, setRandomBuddyUsername] = useState<string>("");

	useEffect(() => {
		if (socket) {
			socket.on("users", (data) => {
				setUsers(data.users);
			});
		}
	}, [username]);

	const get_comp = () => {
		if (randomChatFound) {
			return (
				<ChatBox
					socket={socket}
					roomId={roomId}
					username={username}
					randomBuddyUsername={randomBuddyUsername}
					setRandomChatFound={setRandomChatFound}
				/>
			);
		} else {
			return (
				<Welcome
					users={users}
					socket={socket}
					loading={loading}
					setLoading={setLoading}
					setRandomChatFound={setRandomChatFound}
					setRoomId={setRoomId}
					setRandomBuddyUsername={setRandomBuddyUsername}
				/>
			);
		}
	};

	return <div className="landing">{get_comp()}</div>;
};

export default Landing;
