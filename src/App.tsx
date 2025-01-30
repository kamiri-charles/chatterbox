import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import "boxicons/css/boxicons.min.css";
import "./App.scss";
import { Socket, io } from "socket.io-client";
import PublicRooms from "./pages/PublicRooms";

function App() {
	const [username, setUsername] = useState<string>("");
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {
		// Development
		const newSocket = io("http://localhost:3001");

		// Production
		// const newSocket = io("https://chatterbox-server-4f094ffa6ffe.herokuapp.com/");
		setSocket(newSocket);

		newSocket.on("connect", () => {
			newSocket.emit("new_user", {
				id: newSocket.id,
				username: username,
			});
		});

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

	return (
		<div className="App">
			<Header username={username} setUsername={setUsername} />
			<Router basename="chatterbox">
				<Routes>
					<Route path="/" element={<Landing socket={socket} username={username} />} />
					<Route path="/public-rooms" element={<PublicRooms socket={socket} username={username} />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
