import { Sequelize } from 'sequelize';

// Configure pg
// export const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: process.env.DB_PW,
//     port: 5432
// });

export const sequelize = new Sequelize(process.env.DB_NAME ?? '', process.env.DB_USERNAME ?? '', process.env.DB_PW, {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    dialect: 'postgres'
});