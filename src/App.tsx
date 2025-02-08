import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import { Socket, io } from "socket.io-client";
import PublicRooms from "./pages/PublicRooms";
import "boxicons/css/boxicons.min.css";
import "./App.scss";

function App() {
	const [username, setUsername] = useState<string>("");
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		// Development
		// const newSocket = io("http://localhost:3001");

		// Production
		const newSocket = io("https://chatterbox-server-4f094ffa6ffe.herokuapp.com/");
		setSocket(newSocket);

		// Handle username
		let checkSavedUsername = localStorage.getItem("chatterboxSavedUsername");
		if (checkSavedUsername) {
			setUsername(checkSavedUsername);
		} else {
			setUsername(`User#${Math.floor(Math.random() * 10000)}`);
		}

		return () => {
			newSocket.disconnect();
		};
	}, []);

	// Separate effect to emit event when username is set
	useEffect(() => {
		if (!socket || !username) return; // Ensure socket and username exist

		socket.emit("new_user", {
			id: socket.id,
			username: username,
		});

	}, [socket, username]); 

	return (
		<div className="App">
			<Router basename="chatterbox">
				<Routes>
					<Route
						path="/"
						element={<Landing socket={socket} username={username} setUsername={setUsername} />}
					/>
					<Route
						path="/public-rooms"
						element={<PublicRooms socket={socket} username={username} />}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
