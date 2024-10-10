import "./styles.scss";

interface HeaderProps {
	username: string
}

const Header: React.FC<HeaderProps> = ({username}) => {
	return (
		<div className="header">
			<div className="brand-logo">ChatterBox</div>

			<div className="username">
				{username}
			</div>
		</div>
	)
}

export default Header;