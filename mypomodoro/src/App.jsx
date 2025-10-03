import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pomodoro from "./Pomodoro"; 
import Agenda from "./Agenda"; 
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <Link to="/">Pomodoro</Link>
          <Link to="/agenda">Agenda</Link>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Pomodoro />} />
          <Route path="/agenda" element={<Agenda />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
