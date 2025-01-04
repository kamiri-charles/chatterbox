import { FC, useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { MessageType } from "../../custom_types";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

interface RoomChatProps {
	username: string;
	socket: Socket | undefined;
	roomName: string;
}


const RoomChat: FC<RoomChatProps> = ({ socket, username, roomName }) => {
	const [roomMessages, setRoomMessages] = useState<MessageType[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [inputData, setInputData] = useState<string>("");
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [roomParticipants, setRoomParticipants] = useState<{socketId: string, username: string}[]>([]);

	useEffect(() => {
		if (socket) {

			socket.emit("join_room", {roomName, username});
			
			socket.on("room_participants", (data) => {
				setRoomParticipants(data.participants);
			})

            socket.on("room_messages", (data) => setRoomMessages(data));

			// Handle typing
			textareaRef.current?.addEventListener("input", () => handle_typing());

			// Show typing indicator when the other participant is typing
			socket.on("typing", (data) => {
				if (data.username !== username) {
					setIsTyping(true);
				}
			});

			// Hide typing indicator when the other participant stops typing
			socket.on("stop_typing", (data) => {
				if (data.username !== username) {
					setIsTyping(false);
				}
			});
		}

		return () => {
			if (socket) {
				socket.off("typing");
				socket.off("stop_typing");
			}
		};
	}, [socket]);

	const handle_save = () => {
		alert("This feature is under development!");
	};

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
				socket.emit("typing", { roomName, username });

				typingTimeoutRef.current = setTimeout(() => {
					socket.emit("stop_typing", { roomName, username });
				}, 1000);
			}
		}
	};

	return (
		<div className="room-chat component-wrapper">
			<div className="sub-header">
				<div className="room-name">{roomName}</div>

				<div className="actions">
					<div className="action save" onClick={() => handle_save()}>
						<i className="bx bx-save"></i>
					</div>

					<div className="action exit">
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

								): null}
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
				{/* <div className="typing-alert">
					{isTyping && `${randomBuddyUsername} is typing...`}
				</div> */}

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
