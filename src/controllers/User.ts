import { compare, genSalt, hash } from 'bcryptjs';
import { RequestHandler } from "express";
import { pool } from "../pg";

import dotenv from 'dotenv';
dotenv.config();

// Create new user
export const POST = (async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash new pw
        const salt = await genSalt(Number(process.env.SALT_ROUNDS));
        const hashedPw = await hash(password, salt);

        // Insert new user record and return id
        const { rows } = await pool.query(
            `INSERT INTO users (
                email,
                password
            ) VALUES (
                '${email}',
                '${hashedPw}'
            ) RETURNING id`
        );
        
        // Create new empty cart
        await pool.query(
            `INSERT INTO carts (
                user_id
            ) VALUES (
                ${rows[0].id}
            )`
        );

        res.status(201).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get one by id
export const GET = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT (id, email) FROM users WHERE id = ${req.params.id}`);

        if (!rowCount) return res.status(404).send();

        res.status(200).json(rows[0]);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Update one by id
export const PATCH = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM users WHERE id = ${req.params.id}`);

        if (!rowCount) return res.status(404).send();

        let newBody = { ...rows[0] };
        
        for (const key in req.body) {
            if (newBody[key] !== req.body[key]) {
                newBody[key] = req.body[key];
            }
        }

        await pool.query(
            `UPDATE users SET
                email='${newBody.email}'
                WHERE id = ${req.params.id}
            `)

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Delete one by id
export const DELETE = (async (req, res) => {
    try {
        const { rowCount } = await pool.query(`DELETE FROM users WHERE id = ${req.params.id}`);

        if (!rowCount) return res.status(404).send();

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Login
export const AUTH = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);
        if (!rowCount) return res.status(401).json("Incorrect username or password.");

        const passwordIsCorrect = await compare(req.body.password, rows[0].password);
        if (!passwordIsCorrect) return res.status(401).json("Incorrect username or password.");

        const { password, ...returnedBody } = rows[0];
        
        res.status(200).json(returnedBody);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;