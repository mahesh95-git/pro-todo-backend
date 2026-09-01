import express from "express";
import todoRoutes from "./routes/todo.route";
import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middleware/error.middleware";
import { loggingMiddleware } from "./middleware/logging.middleware";
import { notFoundHandler} from "./middleware/async-handler.middleware";
import { validateHeaders } from "./middleware/validation.middleware";
import cors from "cors";
import {env} from "./config/env";
import helmet from "helmet";

const app = express();
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials:true,
}));
app.use(helmet());

// Logging middleware
app.use(loggingMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request validation middleware
app.use(validateHeaders);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", todoRoutes);


app.use(notFoundHandler);


app.use(errorHandler);

export default app;
