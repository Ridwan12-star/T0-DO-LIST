import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef(null);

  // Load todos
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("todos"));
    if (s) setTodos(s);
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  function handleAddOrUpdate() {
    const text = task.trim();
    if (!text) return;

    if (editingIndex !== null) {
      setTodos((prev) => {
        const copy = [...prev];
        copy[editingIndex] = { ...copy[editingIndex], text };
        return copy;
      });
      setEditingIndex(null);
    } else {
      setTodos((prev) => [
        ...prev,
        { text, done: false, date: new Date().toLocaleString() },
      ]);
    }
    setTask("");
  }

  function handleEdit(index) {
    setTask(todos[index].text);
    setEditingIndex(index);
  }

  function handleCancelEdit() {
    setEditingIndex(null);
    setTask("");
  }

  function handleDelete(index) {
    setTodos((prev) => {
      const newTodos = prev.filter((_, i) => i !== index);
      if (editingIndex !== null) {
        if (index === editingIndex) {
          setEditingIndex(null);
          setTask("");
        } else if (index < editingIndex) {
          setEditingIndex((ei) => ei - 1);
        }
      }
      return newTodos;
    });
  }

  function handleToggleDone(index) {
    setTodos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], done: !copy[index].done };
      return copy;
    });
  }

  function handleClearFinished() {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleAddOrUpdate();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Todo App</h1>

      {/* Dark Mode toggle right under the title */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle"
        style={{ marginBottom: "15px" }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a task"
        />
        <button onClick={handleAddOrUpdate}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
        {editingIndex !== null && (
          <button onClick={handleCancelEdit} className="cancel">
            Cancel
          </button>
        )}
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <span
              className={todo.done ? "done" : ""}
              onClick={() => handleToggleDone(index)}
            >
              {todo.text}
              <br />
              <small style={{ color: "#888" }}>{todo.date}</small>
            </span>
            <div className="actions">
              <button className="edit" onClick={() => handleEdit(index)}>
                Edit
              </button>
              <button className="delete" onClick={() => handleDelete(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="footer">
          <p>
            {remaining > 0
              ? `✅ ${remaining} task(s) left — Keep going, you’re almost done!`
              : "🎉 All tasks completed, great job!"}
          </p>
          <button onClick={handleClearFinished} className="clear">
            Clear Finished
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
