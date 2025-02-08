import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { MetroSpinner } from "react-spinners-kit";
import "./styles.scss";

interface WelcomeProps {
	username: string;
	userCount: number;
	socket: Socket | undefined;
	loading: boolean;
	setLoading: (x: boolean) => void;
	setRandomChatFound: (x: boolean) => void;
	setRoomId: (x: string) => void;
	setRandomBuddyUsername: (x: string) => void;
}

const Welcome: React.FC<WelcomeProps> = ({
	username,
	userCount,
	socket,
	loading,
	setLoading,
	setRandomChatFound,
	setRoomId,
	setRandomBuddyUsername,
}) => {
	const [socketConnected, setSocketConnected] = useState<boolean>(false);
	const nav = useNavigate();

	useEffect(() => {
		if (socket) {
			// Initial check
			setSocketConnected(socket.connected);

			// Listen for connection changes
			const handleConnect = () => setSocketConnected(true);
			const handleDisconnect = () => setSocketConnected(false);

			socket.on("connect", handleConnect);
			socket.on("disconnect", handleDisconnect);

			socket.on("chat_found", (data) => {
				setRoomId(data.room.roomId);

				// Get the other person's username
				const p = data.room.parties.find(
					(x: { id: string | undefined }) => x.id !== socket.id
				);
				setRandomBuddyUsername(p.username);
				setLoading(false);
				setRandomChatFound(true);
			});

			return () => {
				socket.off("connect", handleConnect);
				socket.off("disconnect", handleDisconnect);
				socket.off("chat_found");
			};
		}
	}, [socket]);

	const find_random_chat = () => {
		setLoading(true);
		if (socket) {
			socket.emit("find_random_chat");
		} else {
			alert("Internal server error. Try again later.");
			setLoading(false);
		}
	};

	const cancel_search = () => {
		setLoading(false);
		if (socket) {
			socket.emit("cancel_search");
		}
	};

	return (
		<div className="welcome component-wrapper">
			<div className="welcome-sub-header">
				<div className="left">

					<div className="users-count">
						{socketConnected ? (
							<div className="online">
								<div className="indicator"></div>
								<div>{userCount == 0 ? 0 : userCount - 1} online</div>
							</div>
						) : (
							<div className="offline">
								<div className="indicator"></div>
								<div>Not connected</div>
							</div>
						)}
					</div>

					<div
						className="username" /* onClick={() => setChangeUsernameActive(true)} */
					>
						{username}
						<i className="bx bx-pencil"></i>
					</div>

				</div>

				<div className="right">
					<div className="action">
						<i className="bx bx-sun"></i>
					</div>
					<div className="action">
						<i className="bx bx-cog"></i>
					</div>
					<div className="action">
						<i className="bx bx-dots-vertical-rounded"></i>
					</div>
				</div>
			</div>

			<div className="app-meta">
				<div className="logo">
					<i className="bx bx-message-square"></i>
				</div>

				<div className="welcome-text">
					<div className="welcome-text-title">
						Welcome to <span>chatterbox.</span>
					</div>

					<div className="welcome-text-content">
						Dive into spontaneous conversations with people from around the
						world! Here, you can:
						<ul>
							<li>
								Chat with Random People: Connect with someone new every time you
								start a chat.{" "}
							</li>
							<li>
								Share Thoughts and Ideas: Discuss anything that comes to
								mind—there are no limits!{" "}
							</li>
							<li>
								Have Fun: Enjoy light-hearted banter or deep conversations; it's
								all up to you!{" "}
							</li>
							<li>
								Stay Anonymous: Your privacy is important. No profiles, just
								real conversations.{" "}
							</li>
						</ul>
						Ready to chat? Tap the button below and see who you'll meet next!
						Happy chatting!
					</div>

					{loading ? (
						<div className="searching">
							<div className="loader">
								<MetroSpinner color="black" size={30} />
							</div>
							<button className="cancel-search" onClick={() => cancel_search()}>
								Cancel Search
							</button>
						</div>
					) : (
						<div className="buttons">
							<button
								className="random-chat"
								onClick={() => find_random_chat()}
							>
								Meet My Next Bestie
							</button>

							<button onClick={() => nav("/public-rooms")}>Public Rooms</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Welcome;
