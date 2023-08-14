// App setup and config
import express from 'express';
const app = express();
app.use(express.json());

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
import productRouter from './routers/productRouter';
app.use(productRouter);

import userRouter from './routers/userRouter';
app.use(userRouter);

import cartRouter from './routers/cartRouter';
app.use(cartRouter);

import orderRouter from './routers/orderRouter';
app.use(orderRouter);

// Session
import SQLite from 'connect-sqlite3';
import session, { Store } from 'express-session';
import passport from 'passport';
import path from 'path';

app.use(express.static(path.join(__dirname, 'public')));

const SQLiteStore = SQLite(session);
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true
    },
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: './var/db'
    }) as Store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.authenticate('session'));

// Verification
import { LocalStrategy } from './passport';
passport.use(LocalStrategy);

passport.serializeUser((user, done) => {
    process.nextTick(() => {
        done(null, user);
    });
});

passport.deserializeUser((user: Express.User | null | undefined | false, done) => {
    process.nextTick(() => {
        done(null, user);
    });
});

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