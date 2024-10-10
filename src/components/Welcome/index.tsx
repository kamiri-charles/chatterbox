import { UserType } from "../../custom_types";
import "./styles.scss";


interface WelcomeProps {
	users: UserType[];
}

const Welcome: React.FC<WelcomeProps> = ({ users }) => {
	return (
		<div className="welcome">
			<div className="users-count">
				<div className="online"></div>{" "}
				{users.length == 0 ? 0 : users.length - 1} online
			</div>

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

					<div className="buttons">
						<button className="random-chat">Meet My Next Bestie</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
