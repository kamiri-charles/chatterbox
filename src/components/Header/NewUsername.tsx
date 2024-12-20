import { useRef, useState } from "react";

interface NewUsernameProps {
	changeUsernameActive: boolean;
	setUsername: (x: string) => void;
	setChangeUsernameActive: (x: boolean) => void;
}

export const NewUsername: React.FC<NewUsernameProps> = ({
	changeUsernameActive,
	setUsername,
	setChangeUsernameActive,
}) => {
	const [inputData, setInputData] = useState<string>("");
	const checkedInputRef = useRef<HTMLInputElement>(null);

	const handleChangeUsername = () => {
		// Check errors
		if (inputData.length == 0) {
			alert("Username cannot be empty!");
		} else if (inputData.length < 8) {
			alert("Username must contain a minimum of 8 characters.");
		} else if (inputData.length > 20) {
			alert("Username must not contain more than 20 characters.");
		}
		// Add special characters check here.
		else {
			if (checkedInputRef.current?.checked) {
				localStorage.setItem("chatterboxSavedUsername", inputData);
			}
			setUsername(inputData);
			setInputData("");
			setChangeUsernameActive(false);
		}
	};

	return (
		<div className={`new-username ${changeUsernameActive ? "active" : ""}`}>

			<div className="close-wrapper" onClick={() => setChangeUsernameActive(false)}><i className="bx bx-x"></i></div>
			<div className="title">Change Username</div>

			<div className="field">
				<input
					type="text"
					placeholder="Enter username"
					value={inputData}
					onChange={(e) => setInputData(e.target.value)}
				/>
			</div>

				<div className="remember-username">
					<input ref={checkedInputRef} type="checkbox" name="remember_username" defaultChecked />
					<span>Remember username</span>
				</div>

			<button
				className="change_username"
				onClick={() => handleChangeUsername()}
			>
				Done
			</button>
		</div>
	);
};
