import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});

// Configure pg
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PW,
    port: 5432
});

// Create tables
export const createTables = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id uuid PRIMARY KEY,
            name varchar(255) NOT NULL,
            description varchar(255) NOT NULL,
            price money NOT NULL DEFAULT 0.00,
            categories text[],
            sizes varchar(15)[],
            colours varchar(15)[]
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY,
            auth_id text NOT NULL UNIQUE
        )
    `);

    await pool.query(`
        CREATE TYPE cart_item AS (
            product_id uuid REFERENCES products ON DELETE CASCADE,
            quantity int NOT NULL DEFAULT 1
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS carts (
            id uuid PRIMARY KEY,
            user_id uuid REFERENCES users ON DELETE CASCADE,
            items cart_item[] NOT NULL DEFAULT '{}'
        )
    `);

    await pool.query(`
        CREATE TYPE order_item AS (
            name varchar(255) NOT NULL,
            price money NOT NULL,
            quantity int NOT NULL
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id uuid PRIMARY KEY,
            user_id uuid REFERENCES users ON DELETE SET NULL,
            date_placed bigint NOT NULL,
            items order_item[] NOT NULL
        )
    `);

    console.log("[server] pg tables complete");    
}