import { useEffect, useState } from "react";
import { MessageType } from "../../custom_types";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "./styles.scss";

interface ChatBoxProps {
	socket: Socket | undefined;
	username: string;
	roomId: string;
	randomBuddyUsername: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
	socket,
	username,
	roomId,
	randomBuddyUsername
}) => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [typingAlert, setTypingAlert] = useState<string>("");
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

	const get_time = (t: Date | string) => {
		let dateObj = typeof t === "string" ? new Date(t) : t;

		return dateObj.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});;
	}

	return (
		<div className="chat-box">
			<div className="partner-username">You are chatting with {randomBuddyUsername}.</div>
			<div className="messages-wrapper">
				{messages.length > 0 ? (
					<>
						{messages.map((msg, idx) => (
							<div
								className={`message ${
									msg.sender !== username ? "received" : ""
								}`}
								key={idx}
							>
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
				<div className="typing-alert"></div>
				<input
					placeholder="Enter message"
					value={inputData}
					onChange={(e) => setInputData(e.target.value)}
				></input>

				<div className="send-btn" onClick={() => handle_send_message()}>
					<i className="bx bx-send"></i>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
