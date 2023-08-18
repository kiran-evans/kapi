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
            price real NOT NULL DEFAULT 0.00,
            categories text[] NOT NULL,
            sizes varchar(15)[] NOT NULL,
            colours varchar(15)[] NOT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY,
            auth_id text NOT NULL UNIQUE
        )
    `);

    // See if type exists
    const cart_item = await pool.query(`SELECT 1 FROM pg_type WHERE typname = 'cart_item'`);
    // Create it if it doesn't exist
    if (!cart_item.rowCount) {
        await pool.query(`
            CREATE TYPE cart_item AS (
                product_id uuid,
                quantity int,
                colour varchar(15),
                size varchar(15)
            );
        `);
    }    

    await pool.query(`
        CREATE TABLE IF NOT EXISTS carts (
            id uuid PRIMARY KEY,
            user_id uuid REFERENCES users ON DELETE CASCADE,
            items cart_item[] NOT NULL DEFAULT '{}'
        )
    `);

    // See if type exists
    const order_item = await pool.query(`SELECT 1 FROM pg_type WHERE typname = 'order_item'`);
    // Create it if it doesn't exist
    if (!order_item.rowCount) {
        await pool.query(`
            CREATE TYPE order_item AS (
                name varchar(255),
                price real,
                quantity int
            );
        `);
    }
    
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