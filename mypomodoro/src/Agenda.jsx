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
      setTasks([...tasks, input]);
      setInput("");
    }
  };

 const deleteTask = (index) => {
  const element = document.getElementById(tasks[index].id);
  if (element) {
    element.classList.add("removing");
    setTimeout(() => {
      setTasks((prev) => prev.filter((_, i) => i !== index));
    }, 200); // matches CSS transition
  }
};


  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = Array.from(tasks);
    const [reorderedItem] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedItem);
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
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      id={task.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "dragging" : ""}
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
