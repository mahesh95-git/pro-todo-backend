import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ConflictError, ValidationError } from "../utils/app-error";
import { JwtPayload } from "../types/auth.types";
import { env } from "../config/env";

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 */
const generateToken = (userId: number, email: string): string => {
    const payload: JwtPayload = { userId, email };
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY } as any);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new ValidationError("Invalid or expired token");
    }
};

/**
 * Register new user
 */
export const registerUser = async (
    email: string,
    password: string,
    name?: string
) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name || null,
        },
        select: {
            id: true,
            email: true,
            name: true,
        },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    return {
        user,
        token,
    };
};

/**
 * Login user
 */
export const loginUser = async (email: string, password: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
        },
    });

    if (!user) {
        throw new ValidationError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new ValidationError("Invalid email or password");
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token,
    };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new ValidationError("User not found");
    }

    return user;
};
