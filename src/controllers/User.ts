import { pbkdf2, randomBytes } from 'crypto';
import dotenv from 'dotenv';
import { RequestHandler } from "express";
import passport from "passport";
import { pool } from "../pg";

dotenv.config({
    path: '../.env'
});

// Create new user
export const POST = (async (req, res) => {
    try {
        // Hash new pw
        const salt = randomBytes(Number(process.env.SALT_ROUNDS));
        pbkdf2(req.body.password, salt, Number(process.env.ITERATIONS), Number(process.env.KEYLEN), String(process.env.DIGEST), async (err, hashedPw) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            // Insert new user record and return id
            const { rows } = await pool.query(
                `INSERT INTO users (
                    email,
                    hashedPw,
                    salt
                ) VALUES (
                    '${req.body.email}',
                    '${hashedPw.toString("hex")}',
                    '${salt.toString("hex")}'
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
        });

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
export const LOGIN = (async (req, res) => {
    try {
        passport.authenticate('local', (err: any, user: any) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            if (!user) return res.status(401).json("Incorrect email or password");

            res.status(200).json(user);
        })
    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;