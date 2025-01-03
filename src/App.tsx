import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import "boxicons/css/boxicons.min.css";
import "./App.scss";

function App() {
	const [username, setUsername] = useState<string>("");

	useEffect(() => {
		let checkSavedUsername = localStorage.getItem("chatterboxSavedUsername");
		if (checkSavedUsername) {
			setUsername(checkSavedUsername);
		} else {
			setUsername(`User#${Math.floor(Math.random() * 10000)}`);
		}
	}, []);

	return (
		<div className="App">
			<Header username={username} setUsername={setUsername} />
			<Router basename="chatterbox">
				<Routes>
					<Route path="/" element={<Landing username={username} />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
