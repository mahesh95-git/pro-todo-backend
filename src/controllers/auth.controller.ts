import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema, formatZodErrors } from "../validators/auth.validator";
import { registerUser, loginUser, getUserById } from "../services/auth.service";
import { asyncHandler } from "../middleware/async-handler.middleware";
import { ValidationError } from "../utils/app-error";
import { getCurrentUserId } from "../middleware/auth.middleware";
import { RegisterRequest, LoginRequest } from "../types/auth.types";
import { sendSuccess, sendError } from "../utils/response";


export const register = asyncHandler(async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction
) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        sendError(res, "Validation failed", {
            statusCode: 400,
            errors: formatZodErrors(result.error),
        });
        return;
    }

    const { email, password, name } = result.data;

    const { user, token } = await registerUser(email, password, name);

    sendSuccess(
        res,
        {
            id: user.id,
            email: user.email,
            name: user.name,
            token,
        },
        {
            message: "User registered successfully",
            statusCode: 201,
        }
    );
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction
) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        sendError(res, "Validation failed", {
            statusCode: 400,
            errors: formatZodErrors(result.error),
        });
        return;
    }

    const { email, password } = result.data;

    const { user, token } = await loginUser(email, password);

    sendSuccess(
        res,
        {
            id: user.id,
            email: user.email,
            name: user.name,
            token,
        },
        {
            message: "Login successful",
            statusCode: 200,
        }
    );
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = getCurrentUserId(req);

    const user = await getUserById(userId);

    sendSuccess(res, user, {
        message: "User profile retrieved successfully",
    });
});
