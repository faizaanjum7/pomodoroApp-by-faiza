import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

function Agenda() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("agendaTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("agendaTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim()) {
      const newTask = { id: Date.now().toString(), text: input };
      setTasks([...tasks, newTask]);
      setInput("");
    }
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <div className="agenda-container">
      <h1>Today's Agenda</h1>
      <div className="agenda-box">
        <input
          type="text"
          placeholder="Enter your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        transition: snapshot.isDragging
                          ? "none"
                          : "transform 0.25s ease",
                        backgroundColor: snapshot.isDragging
                          ? "#f5f5f5"
                          : "#fff",
                        boxShadow: snapshot.isDragging
                          ? "0 3px 6px rgba(0,0,0,0.15)"
                          : "none",
                      }}
                    >
                      <span>{task.text}</span>
                      <button onClick={() => deleteTask(index)}>✖</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Agenda;
