import { useEffect, useState } from "react";
import { MessageType } from "../../custom_types";
import { Socket } from "socket.io-client";
import "./styles.scss";

interface ChatBoxProps {
	socket: Socket | undefined;
	messages: MessageType[];
	setMessages: (x: MessageType[]) => void;
	username: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
	socket,
	messages,
	setMessages,
	username,
}) => {
	const [message, setMessage] = useState<string>();

	useEffect(() => {
		if (socket) {
			socket.on("messages", (data) => setMessages(data.messages));
		}
	}, []);

	const handle_send_message = () => {
		if (socket) {
			const msg = {
				content: message,
				username: username,
			};

			socket.emit("new_message", msg);
			setMessage("");
		}
	};

	return (
		<div className="chat-box">
			<div className="messages-wrapper">
				{messages.length > 0 ? (
					<>
						{messages.map((msg, idx) => (
							<div className={`message ${msg.username !== username ? 'received' : ''}`} key={idx}>
								{msg.content}
							</div>
						))}
					</>
				) : null}
			</div>

			<div className="input-field">
				<textarea
					placeholder="Enter message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				></textarea>

				<div className="send-btn" onClick={() => handle_send_message()}>
					<i className="bx bx-send"></i>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
