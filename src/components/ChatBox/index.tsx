import { useEffect, useState } from "react";
import { MessageType } from "../../custom_types";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

interface ChatBoxProps {
	socket: Socket | undefined;
	username: string;
	roomId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
	socket,
	username,
	roomId
}) => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [inputData, setInputData] = useState<string>();

	useEffect(() => {
		if (socket) {
			socket.emit("get_messages");
			socket.on("messages", (data) => setMessages(data));
		}
	}, []);

	const handle_send_message = () => {
		if (socket) {
			const msg = {
				id: uuidv4(),
				content: inputData,
				sender: username,
				timestamp: new Date()
			};

			socket.emit("new_message", {roomId, msg});
			setInputData("");
		}
	};

	return (
		<div className="chat-box">
			<div className="room-id">{roomId}</div>
			<div className="messages-wrapper">
				{messages.length > 0 ? (
					<>
						{messages.map((msg, idx) => (
							<div className={`message ${msg.sender !== username ? 'received' : ''}`} key={idx}>
								{msg.content}
							</div>
						))}
					</>
				) : null}
			</div>

			<div className="input-field">
				<textarea
					placeholder="Enter message"
					value={inputData}
					onChange={(e) => setInputData(e.target.value)}
				></textarea>

				<div className="send-btn" onClick={() => handle_send_message()}>
					<i className="bx bx-send"></i>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
