import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

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
            id BIGSERIAL PRIMARY KEY,
            name varchar(255) NOT NULL,
            description varchar(255) NOT NULL,
            price money NOT NULL DEFAULT 0.00
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            email varchar(255) NOT NULL UNIQUE,
            password text NOT NULL
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS carts (
            id BIGSERIAL PRIMARY KEY,
            user_id bigint REFERENCES users ON DELETE CASCADE,
            items bigint[]
        )
    `);

    // await pool.query(`
    //     CREATE TYPE order_item AS (
    //         name varchar(255),
    //         price money,
    //         quantity int
    //     );
    // `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id BIGSERIAL PRIMARY KEY,
            user_id bigint REFERENCES users ON DELETE SET NULL,
            items order_item[] NOT NULL
        )
    `);
}