import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Todo.css";

const API_URL = "/tasks.json";

const speak = (message) => {
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.speak(speech);
};

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");

  const getTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = { id: Date.now(), name: input, isCompleted: false };
    setTasks([...tasks, newTask]);
    setInput("");
    speak("Task added");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    const taskStatus = updatedTasks.find((task) => task.id === id).isCompleted
      ? "Completed"
      : "Pending";
    speak(`Task marked as ${taskStatus}`);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    speak(`Task deleted`);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.isCompleted;
    if (filter === "Pending") return !task.isCompleted;
    return true;
  });
  return (
    <div className="todo-container" role="main">
      <div className="task-title">
        <h2> ToDo List</h2>
      </div>
      <div className="task-input-container">
        <label htmlFor="taskInput">Add a new task:</label>
        <input
          id="taskInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          aria-label="Task input"
        />
        <button onClick={addTask} aria-label="Add task">
          Add Task
        </button>
      </div>
      <div className="filter-container">
        <label htmlFor="filterDropdown" className="filter-label">Filter:</label>
        <select
          id="filterDropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter tasks"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      {filteredTasks.length > 0 ? (
        <ul aria-live="polite" aria-relevant="additions removals">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleTask(task.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    toggleTask(task.id);
                  }
                }}
                tabIndex="0"
                aria-label={`Mark ${task.name} as ${
                  task.isCompleted ? "Pending" : "Completed"
                }`}
              />
              <span
                style={{
                  textDecoration: task.isCompleted ? "line-through" : "none",
                }}
              >
                {task.name}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete task ${task.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Todo;
