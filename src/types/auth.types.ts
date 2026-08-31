export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        email: string;
        name?: string;
        token: string;
    };
    error?: string;
}

export interface JwtPayload {
    userId: number;
    email: string;
}

export interface AuthenticatedRequest {
    userId: number;
    email: string;
}
