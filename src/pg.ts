import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});

// Configure pg
// export const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: process.env.DB_PW,
//     port: 5432
// });

export const sequelize = new Sequelize('postgres', 'postgres', process.env.DB_PW, {
    host: 'localhost',
    dialect: 'postgres'
});