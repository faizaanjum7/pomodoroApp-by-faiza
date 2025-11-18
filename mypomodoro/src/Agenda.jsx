import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

function Agenda() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("agendaTasks");
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      // Filter out invalid tasks (empty text, null, undefined, or invalid structure)
      const validTasks = Array.isArray(parsed) 
        ? parsed.filter(task => task && typeof task === 'object' && task.text && task.text.trim() !== '')
        : [];
      
      return validTasks;
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
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
    const element = document.getElementById(tasks[index].id);
    if (element) {
      element.classList.add("removing");
      setTimeout(() => {
        setTasks((prev) => prev.filter((_, i) => i !== index));
      }, 200);
    }
  };

  const clearAllTasks = () => {
    setTasks([]);
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
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.length > 0 && (
        <button onClick={clearAllTasks} className="clear-all-btn">
          Clear All
        </button>
      )}

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
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
                      <button onClick={() => deleteTask(index)}>×</button>
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
