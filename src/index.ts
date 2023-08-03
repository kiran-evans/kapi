// App setup and config

import express from 'express';
const app = express();
app.use(express.json());

import dotenv from 'dotenv';
dotenv.config();

import cors, { CorsOptions } from 'cors';
const corsOptions: CorsOptions = {
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Routes

import productRouter from './routers/productRouter';
app.use(productRouter);

import userRouter from './routers/userRouter';
app.use(userRouter);

import cartRouter from './routers/cartRouter';
app.use(cartRouter);

import orderRouter from './routers/orderRouter';
app.use(orderRouter);

// Create tables
import { createTables } from './pg';
(async () => {
    await createTables();
})();

// Server start

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`[server]: Server is running on http://localhost:${port}`);
});