import { useState, useEffect, useRef } from "react";
import "./App.css";
import { messaging, getToken } from "./firebase";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef(null);

  // -------------------------------
  // Firebase Push Notifications
  // -------------------------------
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BFYcdMhlfBRhSnVu7GKdtdGdpaAOWLUG85QS4CW63DFXvcW1e3c0xlVR-_IqVxTVhzlc-t8n6i6wlXiu7D3kCE",
        });
        console.log("FCM Token:", token);
        // Save this token if you want to send notifications from Firebase Console
      } else {
        console.log("Notification permission denied");
      }
    };

    requestPermission();
  }, []);

  // -------------------------------
  // Load todos
  // -------------------------------
  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("todos"));
    if (s) setTodos(s);
  }, []);

  // -------------------------------
  // Save todos
  // -------------------------------
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // -------------------------------
  // Focus input when editing
  // -------------------------------
  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  // -------------------------------
  // Todo handlers
  // -------------------------------
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
      const reminder = prompt(
        "Enter reminder time in HH:MM (24h format), leave blank for no reminder"
      );

      const newTodo = {
        text,
        done: false,
        date: new Date().toLocaleString(),
        reminder: reminder || null,
      };

      setTodos((prev) => [...prev, newTodo]);

      // Schedule local notification (works if PWA is open)
      if (reminder && "Notification" in window && Notification.permission === "granted") {
        const [hours, minutes] = reminder.split(":").map(Number);
        const now = new Date();
        const reminderTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes,
          0
        );

        let delay = reminderTime.getTime() - now.getTime();
        if (delay < 0) delay += 24 * 60 * 60 * 1000; // schedule for next day if time passed

        setTimeout(() => {
          new Notification("Todo Reminder", {
            body: `⏰ ${text}`,
            icon: "/logo192.png",
          });
        }, delay);
      }
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

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Todo App</h1>

      {/* Dark Mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle"
        style={{ marginBottom: "15px" }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Input group */}
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

      {/* Todo list */}
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
              {todo.reminder && (
                <>
                  <br />
                  <small style={{ color: "#555" }}>⏰ Reminder: {todo.reminder}</small>
                </>
              )}
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

      {/* Footer */}
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
