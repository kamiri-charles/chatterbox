import { FC, useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { MessageType } from "../../custom_types";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

interface RoomChatProps {
	username: string;
	socket: Socket | undefined;
	roomName: string;
	setJoinedPubRoom: Dispatch<SetStateAction<boolean>>;
}

const RoomChat: FC<RoomChatProps> = ({ socket, username, roomName, setJoinedPubRoom }) => {
	const [roomMessages, setRoomMessages] = useState<MessageType[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [inputData, setInputData] = useState<string>("");
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [roomParticipants, setRoomParticipants] = useState<{socketId: string, username: string}[]>([]);
	const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);

	useEffect(() => {
		if (socket) {
			socket.emit("join_room", { roomName, username });

			socket.on("room_participants", (data) => {
				setRoomParticipants(data.participants);
			});

			socket.on("room_messages", (data) => setRoomMessages(data));

			socket.on("pub_typing_ev", (typing_user) => {
				setCurrentlyTyping((prev) => {
					if (prev.includes(typing_user) || typing_user === username)
						return prev;
					return [...prev, typing_user];
				});
			});

			socket.on("pub_stop_typing_ev", (typing_user) => {
				setCurrentlyTyping((prev) => prev.filter((x) => x !== typing_user));
			});

			// Handle typing
			textareaRef.current?.addEventListener("input", () => handle_typing());
		}

		return () => {
			if (socket) {
				socket.off("pub_typing_ev");
				socket.off("pub_stop_typing_ev");
			}
		};
	}, [socket]); 


	const get_time = (t: Date | string) => {
		let dateObj = typeof t === "string" ? new Date(t) : t;

		return dateObj.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const handle_key_down = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault(); // Prevents newline
			handle_send_message();
		}
	};

	const handle_send_message = () => {
		if (socket && inputData.length > 0) {
			const msg = {
				id: uuidv4(),
				content: inputData,
				sender: username,
				timestamp: new Date(),
			};

			socket.emit("send_message", { roomName, msg });
			setInputData("");
		}
	};

	const handle_typing = () => {
		if (textareaRef.current) {
			// Adjust textarea height
			let abs_height = parseInt(textareaRef.current.style.height);
			if (abs_height <= 60) {
				textareaRef.current.style.height = "auto";
				textareaRef.current.style.height =
					textareaRef.current.scrollHeight + "px";
			} else {
				textareaRef.current.style.height = "60px";
			}

			// Emit 'typing' event with a debounce
			if (socket) {
				if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
				socket.emit("pub_typing", { username, roomName });

				typingTimeoutRef.current = setTimeout(() => {
					socket.emit("pub_stop_typing", { username, roomName });
				}, 1000);
			}
		}
	};

	const handle_currently_typing_display = () => {
		if (currentlyTyping.length >= 4) return "Multiple users are typing...";

		return currentlyTyping.map((t) => `${t} is typing`).join(", ");
	};


	const exit__pub_room = () => {
		if (socket) {
			socket.emit("leave_room", { username, roomName });
			setJoinedPubRoom(false);
		}
	}

	return (
		<div className="room-chat component-wrapper">
			<div className="sub-header">
				<div className="room-name">{roomName}</div>

				<div className="actions">
					<div className="room-participants">
						<span>{roomParticipants.length}</span>
						<i className="bx bx-user"></i>
					</div>

					<div className="action exit" onClick={() => exit__pub_room()}>
						<i className="bx bx-x"></i>
					</div>
				</div>
			</div>
			<div className="messages-wrapper">
				{roomMessages.length > 0 ? (
					<>
						{roomMessages.map((msg, idx) => (
							<div
								className={`message${
									msg.sender !== username ? " received" : ""
								}`}
								key={idx}
							>
								{msg.sender !== username ? (
									<div className="sender">{msg.sender}</div>
								) : null}
								{msg.content}
								<div className="timestamp">{get_time(msg.timestamp)}</div>
							</div>
						))}
					</>
				) : (
					<div className="no-messages">
						It's a bit quiet here... Start the convo with a fun fact or a random
						question!
					</div>
				)}
			</div>

			<div className="input-field">
				{currentlyTyping.length > 0 ? (
					<div className="typing-alert">
						{handle_currently_typing_display()}
					</div>
					) : ""}
				<textarea
					ref={textareaRef}
					placeholder="Enter message"
					value={inputData}
					onChange={(e) => setInputData(e.target.value)}
					onKeyDown={handle_key_down}
				></textarea>

				<div className="send-btn" onClick={() => handle_send_message()}>
					<i className="bx bx-send"></i>
				</div>
			</div>
		</div>
	);
};

export default RoomChat;
