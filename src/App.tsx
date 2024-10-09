import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Header /> } />
      </Routes>
    </Router>
  )
}

export default App
