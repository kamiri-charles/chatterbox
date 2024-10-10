import { Socket } from "socket.io-client";
import { MetroSpinner } from "react-spinners-kit";
import { UserType } from "../../custom_types";
import "./styles.scss";

interface WelcomeProps {
	users: UserType[];
	socket: Socket | undefined;
	loading: boolean;
	setLoading: (x: boolean) => void;
	setConnected: (x: boolean) => void;
}

const Welcome: React.FC<WelcomeProps> = ({
	users,
	socket,
	loading,
	setLoading,
	setConnected
}) => {
	const connect_server = () => {
		setLoading(true);
		if (socket) {
			setConnected(true);

		} else {
			alert("Internal server error. Try again later.");
			setLoading(false);
		}
	};

	return (
		<div className="welcome">
			<div className="users-count">
				<div className="online"></div>{" "}
				{users.length == 0 ? 0 : users.length - 1} online
			</div>

			{loading ? (
				<div className="loader">
					<MetroSpinner color="black" />

					<div className="load-text">
						Scanning the universe for your next chat buddy...
					</div>
				</div>
			) : (
				<div className="app-meta">
					<div className="logo">
						<i className="bx bx-message-square"></i>
					</div>

					<div className="welcome-text">
						<div className="welcome-text-title">Welcome to ChatterBox!</div>

						<div className="welcome-text-content">
							Dive into spontaneous conversations with people from around the
							world! Here, you can:
							<ul>
								<li>
									Chat with Random People: Connect with someone new every time
									you start a chat.{" "}
								</li>
								<li>
									Share Thoughts and Ideas: Discuss anything that comes to
									mind—there are no limits!{" "}
								</li>
								<li>
									Have Fun: Enjoy light-hearted banter or deep conversations;
									it's all up to you!{" "}
								</li>
								<li>
									Stay Anonymous: Your privacy is important. No profiles, just
									real conversations.{" "}
								</li>
							</ul>
							Ready to chat? Tap the button below and see who you'll meet next!
							Happy chatting!
						</div>

						<div className="buttons">
							<button
								className="random-chat"
								onClick={() => connect_server()}
							>
								Meet My Next Bestie
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Welcome;
