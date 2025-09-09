import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.json({ success: true, todos });
    console.log("Fetched todos:", todos);
  } catch (error) {
    console.error("Error fetching todos:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const addTodo = async (req, res) => {
  const { inputValue, time, dueDate, priority, completed } = req.body;
  const todo = new Todo({ inputValue, time, dueDate, priority, completed, user: req.user._id });
  await todo.save();
  res.json(todo);
};

export const updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(todo);
};

export const deleteTodo = async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Deleted" });
};
