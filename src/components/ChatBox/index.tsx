import { useEffect, useRef, useState } from "react";
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
	randomBuddyUsername,
}) => {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [inputData, setInputData] = useState<string>("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


	useEffect(() => {
		if (socket) {
			socket.emit("get_messages");
			socket.on("messages", (data) => setMessages(data));

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


	const handle_send_message = () => {
		if (socket) {
			const msg = {
				id: uuidv4(),
				content: inputData,
				sender: username,
				timestamp: new Date(),
			};

			socket.emit("new_message", { roomId, msg });
			setInputData("");
		}
	};

	const get_time = (t: Date | string) => {
		let dateObj = typeof t === "string" ? new Date(t) : t;

		return dateObj.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
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
				socket.emit("typing", { roomId, username });

				typingTimeoutRef.current = setTimeout(() => {
					socket.emit("stop_typing", { roomId, username });
				}, 1000);
			}
		}
	};

	const handle_key_down = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault(); // Prevents newline
			handle_send_message();
		}
	};

	return (
		<div className="chat-box">
			<div className="partner-username">
				You are chatting with {randomBuddyUsername}.
			</div>
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
				<div className="typing-alert">
					{isTyping && `${randomBuddyUsername} is typing...`}
				</div>

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

export default ChatBox;
