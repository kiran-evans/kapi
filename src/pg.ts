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
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name varchar(255) NOT NULL,
            description varchar(255) NOT NULL,
            price money NOT NULL DEFAULT 0.00,
            categories text[] NOT NULL,
            sizes varchar(15)[] NOT NULL,
            colours varchar(15)[] NOT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            auth_id text NOT NULL UNIQUE,
            cart_items uuid[] NOT NULL DEFAULT '{}'
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS cart_items (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id uuid REFERENCES products ON DELETE CASCADE,
            quantity int NOT NULL,
            colour varchar(15) NOT NULL,
            size varchar(15) NOT NULL
        )
    `);
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES users ON DELETE SET NULL,
            date_placed bigint NOT NULL,
            items json[] NOT NULL
        )
    `);

    console.log("[server] pg tables complete");    
}