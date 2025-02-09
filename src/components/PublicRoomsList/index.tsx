import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import "./styles.scss";
import { ImpulseSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router-dom";
import TooltipIcon from "../../utils/TooltipIcon";

interface PublicRoomsListProps {
    socket: Socket | undefined;
    setPublicRoomName: Dispatch<SetStateAction<string>>;
    setJoinedPubRoom: Dispatch<SetStateAction<boolean>>;
}

interface RoomBaseProps {
  roomName: string;
  roomDesc: string;
  roomUserCount: number;
}

const PublicRoomsList: FC<PublicRoomsListProps> = ({socket, setPublicRoomName, setJoinedPubRoom}) => {
  const [roomsBaseData, setRoomsBaseData] = useState<RoomBaseProps[]>([]);
  const nav = useNavigate();

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
  }

  return (
		<div className="rooms-list component-wrapper">
			<div className="r-list-header">
				<div className="back" onClick={() => nav("/")}>
					<TooltipIcon iconName="left-arrow-alt" tooltipMessage="Back" size={20} forcedHoverState />
				</div>
				<i className="bx bx-message-square" style={{fontSize: "30px", margin: "0 4px 0 18px"}}></i>
				<span>Public Rooms</span>
			</div>

			<div className="r-list">
				{roomsBaseData.length > 0 ? (
					<>
						{roomsBaseData.map((room, idx) => (
							<div className="room" key={idx}>
								<div className="room-name">{room.roomName}</div>
								<div className="room-desc">{room.roomDesc}</div>
								<div className="user-count">
									<i className="bx bx-user"></i>{" "}
									<span>{room.roomUserCount}</span>
								</div>
								<div
									className="join-room-btn"
									onClick={() => handle_select_room(room.roomName)}
								>
									Connect
								</div>
							</div>
						))}
					</>
				) : (
					<div className="rooms-loader">
						<ImpulseSpinner frontColor="#0c75a1" />
					</div>
				)}
			</div>
		</div>
	);
}

export default PublicRoomsList