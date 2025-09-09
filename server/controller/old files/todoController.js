import Todo from "../models/Todo.js";

export const deleteTodo = async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id, user: req.user._id });
    res.status(200).json({ success: true, message: "Todo removed" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
    console.error("Failed to delete todo:", err.message);
  }
};

export const addTodo = async (req, res) => {
  try {
    const { taskText, time, dueDate, priority, completed } = req.body;
    const newTodo = new Todo({
      taskText,
      time,
      dueDate,
      priority,
      completed,
      user: req.user._id,
    });
    const savedTodo = await newTodo.save();
    res.status(200).json({ success: true, data: savedTodo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
    console.error("Error adding todo:", err.message);
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { returnOriginal: false }
    );
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
    console.error("Error updating todo:", err.message);
  }
};

export const getTodos = async (req, res) => {
  try {
    const todoList = await Todo.find({ user: req.user._id });
    console.log("Retrieved todos:", todoList);
    res.status(200).json({ success: true, data: todoList });
  } catch (err) {
    console.error("Failed to fetch todos:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};