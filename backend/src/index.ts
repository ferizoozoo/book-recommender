import 'dotenv/config';

import express from 'express';
import appRouter from "./presentation/routes";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRouter);

app.listen(PORT, () => {
    console.log('Server is running');
});