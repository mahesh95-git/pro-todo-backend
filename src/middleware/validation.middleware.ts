import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

/**
 * Validation Error Middleware
 * Handles validation errors and formats them nicely
 */
export const validationErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle Zod validation errors
    if (err.name === "ZodError") {
        const errors = err.issues.map((issue: any) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }

    next(err);
};

/**
 * Request Validation Middleware
 * Validates that required headers are present
 */
export const validateHeaders = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const contentType = req.headers["content-type"];

    if (req.method !== "GET" && !contentType?.includes("application/json")) {
        throw new AppError(
            "Content-Type must be application/json",
            400
        );
    }

    next();
};
