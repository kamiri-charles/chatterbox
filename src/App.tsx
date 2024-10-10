import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Chat from "./pages/Chat";
import "boxicons/css/boxicons.min.css";
import "./App.css";

function App() {
	const [username, setUsername] = useState<string>("");

	useEffect(() => {
		setUsername(`User#${Math.floor(Math.random() * 1000)}`);
	}, []);

	return (
		<div className="App">
			<Header username={username} />
			<Router>
				<Routes>
					<Route path="/" element={<Chat username={username} />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
