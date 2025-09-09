import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskText: { type: String, required: true },
  taskTime: { type: String },
  deadline: { type: String },
  importance: { type: String, default: "low" },
  isDone: { type: Boolean, default: false },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  collection: "tasks",
});

export default mongoose.model("Task", taskSchema);