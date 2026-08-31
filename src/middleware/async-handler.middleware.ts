import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";


export const asyncHandler = <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req as T, res, next)).catch(next);
    };
};


export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    throw new AppError(`Route not found: ${req.path}`, 404);
};





