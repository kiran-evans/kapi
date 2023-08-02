import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

// Configure pg
const DB_PW = process.env.DB_PW;
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: DB_PW,
    port: 5432
});