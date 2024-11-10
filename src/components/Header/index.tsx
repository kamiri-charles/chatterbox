import { useState } from "react";
import { NewUsername } from "./NewUsername";
import "./styles.scss";

interface HeaderProps {
	username: string;
	setUsername: (x: string) => void;
}

const Header: React.FC<HeaderProps> = ({ username, setUsername }) => {
	const [changeUsernameActive, setChangeUsernameActive] = useState(false);

	return (
		<div className="header">
			<div className="brand-logo">ChatterBox</div>

			<div className="username" onClick={() => setChangeUsernameActive(true)}>
				{username}
				<i className="bx bx-edit-alt"></i>
			</div>

			<NewUsername
				setUsername={setUsername}
				changeUsernameActive={changeUsernameActive}
				setChangeUsernameActive={setChangeUsernameActive}
			/>
		</div>
	);
};

export default Header;
