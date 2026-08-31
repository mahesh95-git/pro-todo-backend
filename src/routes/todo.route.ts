import {Router} from "express";
import { getTodos, createTodo, getTodoById, updateTodo, deleteTodo } from "../controllers/todo.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All todo routes are protected
router.use(authMiddleware);

router.get("/todos", getTodos);
router.post("/todos", createTodo);
router.get("/todos/:id", getTodoById);
router.patch("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

export default router;