import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Pomodoro from "./Pomodoro"; 
import Agenda from "./Agenda"; 
import "./App.css";

function App() {
  return (
    <Router>
      <div className="navbarbg">
        {/* Navbar */}
       <nav className="navbar">
  <NavLink
    to="/"
    end
    className={({ isActive }) =>
      "nav-link" + (isActive ? " active" : "")
    }
  >
    Pomodoro
  </NavLink>
  <NavLink
    to="/agenda"
    className={({ isActive }) =>
      "nav-link" + (isActive ? " active" : "")
    }
  >
    Agenda
  </NavLink>
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
