// App setup and config
import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});

import cors, { CorsOptions } from 'cors';
const corsOptions: CorsOptions = {
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Routes
import path from 'path';
app.use('/public', express.static(path.join(__dirname, 'public')));

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
app.listen(process.env.PORT, () => {
  console.log(`[server] server started on ${process.env.DOMAIN}`);
});