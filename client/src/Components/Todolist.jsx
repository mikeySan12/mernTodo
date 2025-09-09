import React, { useState, useEffect, useRef, useContext } from "react";
import axiosInstance from "../../api/axiosInstane.js";
import { AppContent } from "../context/AppContext";

function Todolist() {
  const { backendUrl } = useContext(AppContent); // ensure backend URL is used if needed
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [time, setTime] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [completed, setCompleted] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  const inputRef = useRef(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get("/todos"); 
      console.log("Fetched todos:", res.data);
      if (res.data.success) {
        setTodos(res.data.todos || []);
      } else {
        setTodos([]); // fallback if no todos
      }
    } catch (err) {
      console.error("Fetch todos error:", err.response?.data || err.message);
      setTodos([]); // clear UI if error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const todoData = { inputValue, time, dueDate, priority, completed };
    console.log("Sending todo:", todoData);

    try {
      if (editId) {
        await axiosInstance.put(`/todos/${editId}`, todoData);
        setEditId(null);
      } else {
        await axiosInstance.post("/todos", todoData);
      }
      fetchTodos();
      setInputValue("");
      setTime("");
      setDueDate("");
      setPriority("low");
      setCompleted(false);
      inputRef.current.focus();
    } catch (err) {
      console.error("Todo error:", err.response?.data || err.message);
    }
  };

  const handleEdit = (todo) => {
    setInputValue(todo.inputValue);
    setTime(todo.time || "");
    setDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
    setPriority(todo.priority || "low");
    setCompleted(todo.completed || false);
    setEditId(todo._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Delete todo error:", err.response?.data || err.message);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "notCompleted") return !todo.completed;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-800">
      {/* Sidebar */}
      <div className="w-48 bg-gray-700 shadow-lg p-6 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-300">Filters</h2>
        <button
          className={`px-4 py-2 rounded-lg text-sm text-left ${
            filter === "all" ? "bg-gray-600 text-gray-300" : "text-gray-400 hover:bg-gray-600"
          } transition duration-200`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm text-left ${
            filter === "completed" ? "bg-gray-600 text-gray-300" : "text-gray-400 hover:bg-gray-600"
          } transition duration-200`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm text-left ${
            filter === "notCompleted" ? "bg-gray-600 text-gray-300" : "text-gray-400 hover:bg-gray-600"
          } transition duration-200`}
          onClick={() => setFilter("notCompleted")}
        >
          Not Completed
        </button>
      </div>

      {/* Main Section */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold text-gray-300 mb-6">Todo List</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 mb-6">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Task"
            className="w-64 p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-32 p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-40 p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-32 p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="low">Low 🟢</option>
            <option value="medium">Medium 🟡</option>
            <option value="high">High 🔴</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 text-gray-500 bg-gray-700 border-gray-600 rounded focus:ring-gray-500"
            />
            Done
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-500 transition duration-200 shadow-md"
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div key={todo._id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg shadow-md">
              <div>
                <p className={`text-sm font-medium text-gray-300 ${todo.completed ? "line-through text-gray-500" : ""}`}>
                  {todo.inputValue}
                </p>
                <p className="text-xs text-gray-400">
                  {todo.time && `⏰ ${todo.time}`} {todo.dueDate && `📅 ${todo.dueDate?.slice(0,10)}`} •{" "}
                  <span
                    className={
                      todo.priority === "high"
                        ? "text-red-500"
                        : todo.priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {todo.priority}
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(todo)}
                  className="text-blue-400 text-sm hover:text-blue-300 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="text-red-400 text-sm hover:text-red-300 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredTodos.length === 0 && (
            <p className="text-center text-sm text-gray-400">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todolist;