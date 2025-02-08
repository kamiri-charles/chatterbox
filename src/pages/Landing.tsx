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
	const [userCount, setUserCount] = useState<number>(0);
	const [roomId, setRoomId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [randomBuddyUsername, setRandomBuddyUsername] = useState<string>("");

	useEffect(() => {
		if (socket) {
			socket.on("user_count", (data) => setUserCount(data.count));
			socket.emit("get_user_count");
		}
	}, [socket]);

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
					username={username}
					userCount={userCount}
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
