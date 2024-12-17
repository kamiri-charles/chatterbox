import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import "./styles.scss";

interface PublicRoomsProps {
    socket: Socket | undefined;
    setServersDisplay: Dispatch<SetStateAction<boolean>>;
    setPublicRoomName: Dispatch<SetStateAction<string>>;
    setJoinedPubRoom: Dispatch<SetStateAction<boolean>>;
}

interface RoomBaseProps {
  roomName: string;
  roomDesc: string;
  roomUserCount: number;
}

const PublicRooms: FC<PublicRoomsProps> = ({socket, setServersDisplay, setPublicRoomName, setJoinedPubRoom}) => {
  const [roomsBaseData, setRoomsBaseData] = useState<RoomBaseProps[]>([]);

  useEffect(() => {
		if (socket) {
			socket.emit("get_public_rooms");
			socket.on("public_rooms", (data) => {
				setRoomsBaseData(data);
			});

			return () => {
				socket.off("public_rooms");
			};
		}
	}, [socket]);

  const handle_select_room = (room_name: string) => {
    setPublicRoomName(room_name);
    setJoinedPubRoom(true);
    setServersDisplay(false);
  }

  return (
    <div className="rooms-list">
        <div className="r-list-header">
            <div className="back" onClick={() => setServersDisplay(false)}><i className="bx bx-left-arrow-alt"></i></div>
            <i className="bx bx-message-square"></i>
            <span>Public Rooms</span>
        </div>

        <div className="r-list">
            {roomsBaseData.map((room, idx) => (
              <div className="room" key={idx}>
                <div className="room-name">{room.roomName}</div>
                <div className="room-desc">{room.roomDesc}</div>
                <div className="user-count"><i className="bx bx-user"></i> <span>{room.roomUserCount}</span></div>
                <div className="join-room-btn" onClick={() => handle_select_room(room.roomName)}>Connect</div>
              </div>
            ))}
        </div>
    </div>
  )
}

export default PublicRooms