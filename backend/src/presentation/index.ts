import 'dotenv/config';
import "reflect-metadata"
import applicationConfig from "../infrastructure/config/application.config.ts";
import express from 'express';
import appRouter from './routes';
import AppDataSource from "../infrastructure/database/typeorm/main.ts";
import {errorHandler} from "./common/middlewares/errorHandler.middleware.ts";

const app = express();
const PORT = applicationConfig.port || 5000;

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        console.log("Database connection established successfully")
    })
    .catch((error) => console.log(error))

// Middleware
app.use(express.json());

// Routes
app.use('/', appRouter);

app.use(errorHandler)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log('Server is running');
});
