import "./styles.scss";

interface NavbarProps {
	user_count: number;
	users: any[];
}

const Navbar: React.FC<NavbarProps> = ({ user_count, users }) => {
	return (
		<div className="navbar">
			<div className="nav-title">
				<span>Users</span>
				<div className="users-count">
					<div className="online"></div> {user_count}
				</div>
			</div>

			<div className="users-wrapper">
				{user_count > 0}{" "}
				{
					<>
						{users.map((user, idx) => (
							<div className="user" key={idx}>
								<div className="profile-pic">
									<i className="bx bx-user"></i>
								</div>
								<div className="user-meta">
									<div className="name">{user.username ? user.username : "" }</div>
								</div>
							</div>
						))}
					</>
				}
			</div>
		</div>
	);
};

export default Navbar;
