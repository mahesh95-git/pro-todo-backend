import { Request, Response, NextFunction } from "express";
import { updateTodoRequest } from "../types/todo.types";
import { createTodoSchema, updateTodoSchema, todoFilterSchema } from "../validators/todo.validator";
import { NotFoundError, ValidationError } from "../utils/app-error";
import { asyncHandler } from "../middleware/async-handler.middleware";
import { getCurrentUserId } from "../middleware/auth.middleware";
import { sendSuccess, sendPaginated, sendError } from "../utils/response";

import {
    getAllTodos,
    getTodosPaginated,
    createTodo as createTodoService,
    getTodoById as getTodoByIdService,
    updateTodo as updateTodoService,
    deleteTodo as deleteTodoService
} from "../services/todo.service";

/**
 * Get all todos with pagination and filtering
 * GET /api/todos?page=1&limit=10&search=test&completed=false&sortBy=createdAt&sortOrder=desc
 */
export const getTodos = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = getCurrentUserId(req);
    
    // Validate query parameters
    const filterResult = todoFilterSchema.safeParse(req.query);
    
    if (!filterResult.success) {
        sendError(res, "Invalid query parameters", {
            statusCode: 400,
            errors: filterResult.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    const { page, limit, search, completed, sortBy, sortOrder } = filterResult.data;

    // Fetch paginated todos with filters
    const result = await getTodosPaginated(userId, page, limit, {
        search,
        completed,
        sortBy,
        sortOrder,
    });

    sendPaginated(res, result.todos, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        message: "Todos retrieved successfully",
    });
});

/**
 * Create a new todo
 * POST /api/todos
 */
export const createTodo = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = getCurrentUserId(req);
    
    // Validate request body
    const result = createTodoSchema.safeParse(req.body);

    if (!result.success) {
        sendError(res, "Validation failed", {
            statusCode: 400,
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    const todo = await createTodoService(userId, result.data.title);

    sendSuccess(res, todo, {
        message: "Todo created successfully",
        statusCode: 201,
    });
});

/**
 * Get a single todo by ID
 * GET /api/todos/:id
 */
export const getTodoById = asyncHandler(async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    const userId = getCurrentUserId(req);
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        sendError(res, "Invalid todo ID", { statusCode: 400 });
        return;
    }

    const todo = await getTodoByIdService(id, userId);

    if (!todo) {
        sendError(res, `Todo with ID ${id} not found`, { statusCode: 404 });
        return;
    }

    sendSuccess(res, todo, { message: "Todo retrieved successfully" });
});

/**
 * Update a todo
 * PATCH /api/todos/:id
 */
export const updateTodo = asyncHandler(async (
    req: Request<{ id: string }, {}, updateTodoRequest>,
    res: Response,
    next: NextFunction
) => {
    const userId = getCurrentUserId(req);
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        sendError(res, "Invalid todo ID", { statusCode: 400 });
        return;
    }

    // Validate request body
    const result = updateTodoSchema.safeParse(req.body);

    if (!result.success) {
        sendError(res, "Validation failed", {
            statusCode: 400,
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
        return;
    }

    // Check if todo exists first
    const existingTodo = await getTodoByIdService(id, userId);
    if (!existingTodo) {
        sendError(res, `Todo with ID ${id} not found`, { statusCode: 404 });
        return;
    }

    const { title, completed } = result.data;
    const todo = await updateTodoService(id, userId, title, completed);

    sendSuccess(res, todo, {
        message: "Todo updated successfully",
    });
});

/**
 * Delete a todo
 * DELETE /api/todos/:id
 */
export const deleteTodo = asyncHandler(async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    const userId = getCurrentUserId(req);
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        sendError(res, "Invalid todo ID", { statusCode: 400 });
        return;
    }

    const deleted = await deleteTodoService(id, userId);

    if (!deleted) {
        sendError(res, `Todo with ID ${id} not found`, { statusCode: 404 });
        return;
    }

    sendSuccess(res, { id }, {
        message: "Todo deleted successfully",
        statusCode: 200,
    });
});