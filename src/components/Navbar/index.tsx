import "./styles.scss";

type UserType = {
	id: string;
	username: string;
};
interface NavbarProps {
	users: UserType[];
	username: string;
}

const Navbar: React.FC<NavbarProps> = ({ users, username }) => {
	return (
		<div className="navbar">
			<div className="nav-title">
				<span>Users</span>
				<div className="users-count">
					<div className="online"></div>{" "}
					{users.length == 0 ? 0 : users.length - 1}
				</div>
			</div>

			<div className="users-wrapper">
				{users.length > 0}{" "}
				{
					<>
						{users.map((user, idx) => (
							<>
								{user.username !== username ? (
									<div className="user" key={idx}>
										<div className="profile-pic">
											<i className="bx bx-user"></i>
										</div>
										<div className="user-meta">
											<div className="name">
												{user.username ? user.username : ""}
											</div>
										</div>
									</div>
								) : null}
							</>
						))}
					</>
				}
			</div>
		</div>
	);
};

export default Navbar;
