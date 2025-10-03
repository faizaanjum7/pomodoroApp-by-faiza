import React, { useState } from "react";

function Agenda() {
  const [agenda, setAgenda] = useState("");
  const [items, setItems] = useState([]);

  const addAgenda = () => {
    if (agenda.trim() !== "") {
      setItems([...items, agenda]);
      setAgenda("");
    }
  };

  const removeAgenda = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="agenda-container">
      <h1>Today's Agenda</h1>

      <div className="agenda-box">
        <input
          type="text"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          placeholder="Enter your task..."
        />
        <button onClick={addAgenda}>Add</button>
      </div>

      {items.length === 0 ? (
        <p>No agenda yet...</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item}{" "}
              <button onClick={() => removeAgenda(index)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Agenda;
