import { useState } from "react";
import { Socket } from "socket.io-client";
import PublicRoomsList from "../components/PublicRoomsList";
import RoomChat from "../components/RoomChat";

interface PublicRoomsProps {
	socket: Socket | undefined;
	username: string;
}

const PublicRooms: React.FC<PublicRoomsProps> = ({ socket, username }) => {
	const [joinedPubRoom, setJoinedPubRoom] = useState(false);
	const [publicRoomName, setPublicRoomName] = useState<string>("");

	return (
		<div className="public-rooms">
			{joinedPubRoom ? (
				<RoomChat socket={socket} roomName={publicRoomName} username={username} setJoinedPubRoom={setJoinedPubRoom} />
			) : (
				<PublicRoomsList
					socket={socket}
					setPublicRoomName={setPublicRoomName}
					setJoinedPubRoom={setJoinedPubRoom}
				/>
			)}
		</div>
	);
};

export default PublicRooms;
