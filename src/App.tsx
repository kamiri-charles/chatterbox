import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Chat from "./pages/Chat";
import './App.css';

function App() {

  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={ <Chat /> } />
        </Routes>
      </Router>
    </div>
  )
}

export default App
