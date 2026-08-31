import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service";
import { UnauthorizedError } from "../utils/app-error";

/**
 * Extend Express Request with user info
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
            };
        }
    }
}

/**
 * Auth Middleware
 * Verifies JWT token from Authorization header
 */
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError("Authorization header is missing");
        }

        // Extract token from "Bearer <token>"
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new UnauthorizedError("Invalid authorization header format");
        }

        const token = parts[1];

        // Verify token
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
        } else {
            next(new UnauthorizedError("Invalid token"));
        }
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (req: Request): boolean => {
    return !!req.user?.userId;
};

/**
 * Get current user ID from request
 */
export const getCurrentUserId = (req: Request): number => {
    if (!req.user?.userId) {
        throw new UnauthorizedError("User not authenticated");
    }
    return req.user.userId;
};
