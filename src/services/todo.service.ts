import { prisma } from "../lib/prisma";

interface TodoFilters {
    search?: string;
    completed?: boolean;
    sortBy?: "createdAt" | "title";
    sortOrder?: "asc" | "desc";
}

export const getAllTodos = async (userId: number) => {
    return await prisma.todo.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc"
        }
    });
};

/**
 * Get paginated and filtered todos
 */
export const getTodosPaginated = async (
    userId: number,
    page: number = 1,
    limit: number = 10,
    filters?: TodoFilters
) => {
    const skip = (page - 1) * limit;
    const { search, completed, sortBy = "createdAt", sortOrder = "desc" } = filters || {};

    // Build where clause
    const where: any = {
        userId,
        ...(typeof completed !== "undefined" && { completed }),
        ...(search && {
            title: {
                contains: search,
                mode: "insensitive",
            },
        }),
    };

    // Get total count
    const total = await prisma.todo.count({ where });

    // Get paginated results
    const todos = await prisma.todo.findMany({
        where,
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });

    return {
        todos,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    };
};

export const createTodo = async (userId: number, title: string) => {
    return await prisma.todo.create({
        data: {
            title,
            completed: false,
            userId
        }
    });
};

export const getTodoById = async (id: number, userId: number) => {
    const todo = await prisma.todo.findUnique({
        where: { id }
    });
    
    if (todo && todo.userId !== userId) {
        return null; // User doesn't own this todo
    }
    return todo;
};

export const updateTodo = async (
    id: number,
    userId: number,
    title?: string,
    completed?: boolean
) => {
    // First check if user owns this todo
    const todo = await prisma.todo.findUnique({
        where: { id }
    });

    if (!todo || todo.userId !== userId) {
        return null; // User doesn't own this todo
    }

    const updateData: any = {};
    
    if (title !== undefined) {
        updateData.title = title;
    }

    if (completed !== undefined) {
        updateData.completed = completed;
    }

    return await prisma.todo.update({
        where: { id },
        data: updateData
    });
};

export const deleteTodo = async (id: number, userId: number) => {
    try {
        // First check if user owns this todo
        const todo = await prisma.todo.findUnique({
            where: { id }
        });

        if (!todo || todo.userId !== userId) {
            return false; // User doesn't own this todo
        }

        await prisma.todo.delete({
            where: { id }
        });
        return true;
    } catch (error) {
        return false;
    }
};