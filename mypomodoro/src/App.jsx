import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Pomodoro from "./Pomodoro"; 
import Agenda from "./Agenda"; 
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <NavLink to="/">Pomodoro</NavLink>
          <NavLink to="/agenda">Agenda</NavLink>
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
