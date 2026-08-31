
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    timestamp: Date;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date();

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            isOperational: this.isOperational,
            timestamp: this.timestamp,
        };
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = "ValidationError";
    }
}


export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}


export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized") {
        super(message, 401);
        this.name = "UnauthorizedError";
    }
}


export class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden") {
        super(message, 403);
        this.name = "ForbiddenError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
        this.name = "ConflictError";
    }
}