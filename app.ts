import express from 'express';
import apiRouter from './Routers/api-router';

const app = express();

app.use("/api",apiRouter)

export default app;
