import { z } from "zod";

// Todo validators
export const createTodoSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Title is required" })
        .max(200, { message: "Title must be less than 200 characters" })
        .trim(),
});

export const updateTodoSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Title is required" })
        .max(200, { message: "Title must be less than 200 characters" })
        .trim()
        .optional(),
    completed: z
        .boolean()
        .optional(),
});

// Query validators
export const paginationSchema = z.object({
    page: z
        .coerce.number()
        .int()
        .positive()
        .default(1),
    limit: z
        .coerce.number()
        .int()
        .positive()
        .max(100)
        .default(10),
});

export const todoFilterSchema = z.object({
    page: z
        .coerce.number()
        .int()
        .positive()
        .default(1),
    limit: z
        .coerce.number()
        .int()
        .positive()
        .max(100)
        .default(10),
    search: z
        .string()
        .optional(),
    completed: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    sortBy: z
        .enum(["createdAt", "title"])
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
});

// Utility function to format Zod errors
export const formatZodErrors = (error: z.ZodError) => {
    return error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
    }));
};
