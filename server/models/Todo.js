import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  inputValue: { type: String, required: true },
  time: String,
  dueDate: String,
  priority: { type: String, default: "low" },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Todo", todoSchema);
