import express from "express";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../controller/todoController.js";
import userAuth  from "../middleware/userAuth.js";

const router = express.Router();
router.use(userAuth); // all routes require login

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;

