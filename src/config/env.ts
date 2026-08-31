const PORT = Number(process.env.PORT) || 5000;

const NODE_ENV = process.env.NODE_ENV || "development";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";


export const env = {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRY,
    CORS_ORIGIN
};