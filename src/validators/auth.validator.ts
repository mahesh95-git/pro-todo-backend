import { z } from "zod";

export const registerSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .toLowerCase(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(100, { message: "Password must be less than 100 characters" }),
    name: z
        .string()
        .max(100, { message: "Name must be less than 100 characters" })
        .optional(),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .toLowerCase(),
    password: z
        .string()
        .min(1, { message: "Password is required" }),
});

// Utility function to format Zod errors
export const formatZodErrors = (error: z.ZodError) => {
    return error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
    }));
};
