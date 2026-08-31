import { Response } from "express";

/**
 * Standard API Response Format
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        pagination?: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
        timestamp?: string;
    };
    errors?: Array<{
        field?: string;
        message: string;
    }>;
}

/**
 * Send a standardized success response
 */
export const sendSuccess = <T>(
    res: Response,
    data: T,
    options?: {
        message?: string;
        statusCode?: number;
        meta?: any;
    }
): Response => {
    const { message, statusCode = 200, meta } = options || {};

    const response: ApiResponse<T> = {
        success: true,
        ...(message && { message }),
        data,
        ...(meta && { meta }),
    };

    return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 */
export const sendError = (
    res: Response,
    message: string,
    options?: {
        statusCode?: number;
        errors?: Array<{ field?: string; message: string }>;
        data?: any;
    }
): Response => {
    const { statusCode = 400, errors, data } = options || {};

    const response: ApiResponse = {
        success: false,
        message,
        ...(errors && { errors }),
        ...(data && { data }),
    };

    return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
    res: Response,
    data: T[],
    options: {
        total: number;
        page: number;
        limit: number;
        message?: string;
        statusCode?: number;
    }
): Response => {
    const { total, page, limit, message, statusCode = 200 } = options;
    const pages = Math.ceil(total / limit);

    const response: ApiResponse<T[]> = {
        success: true,
        ...(message && { message }),
        data,
        meta: {
            pagination: {
                total,
                page,
                limit,
                pages,
            },
            timestamp: new Date().toISOString(),
        },
    };

    return res.status(statusCode).json(response);
};
