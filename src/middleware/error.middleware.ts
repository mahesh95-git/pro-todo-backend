import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { sendError } from "../utils/response";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);

    // Handle AppError instances
    if (err instanceof AppError) {
        return sendError(res, err.message, {
            statusCode: err.statusCode,
        });
    }

    // Handle Zod validation errors
    if (err instanceof Error && err.name === "ZodError") {
        return sendError(res, "Validation failed", {
            statusCode: 400,
        });
    }

    // Handle Prisma errors
    if (err instanceof Error && err.message.includes("Prisma")) {
        const message = process.env.NODE_ENV === "development" ? err.message : "Database error";
        return sendError(res, message, {
            statusCode: 500,
        });
    }

    // Handle default errors
    if (err instanceof Error) {
        return sendError(res, err.message || "Internal server error", {
            statusCode: 500,
        });
    }

    // Handle unknown errors
    return sendError(res, "Internal server error", {
        statusCode: 500,
    });
};