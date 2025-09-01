import "dotenv/config";
import "reflect-metadata";
import applicationConfig from "../infrastructure/config/application.config.ts";
import express from "express";
import appRouter from "./routes/index.ts";
import AppDataSource from "../infrastructure/database/typeorm/index.ts";
import { errorHandler } from "./common/middlewares/errorHandler.middleware.ts";
import cors from "cors";

const app = express();
const PORT = applicationConfig.port || 5000;

const corsOpts = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite's default port
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOpts));

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    console.log("Database connection established successfully");
  })
  .catch((error) => console.log(error));

// Routes
app.use("/", appRouter);

app.use(errorHandler);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
