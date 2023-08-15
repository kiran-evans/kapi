import dotenv from 'dotenv';
import { RequestHandler } from "express";
import { fb } from '../firebase';
import { pool } from "../pg";

dotenv.config({
    path: '../.env'
});

export type User = {
    id: number,
    email: string,
    hashed_pw: string,
    salt: string
}

// Create new user
export const POST = (async (req, res) => {
    try {        
        // Verify encoded id token passed from client (checks user has been created nad signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.body.idToken);

        // Insert new user record and return id
        const { rows } = await pool.query(
            `INSERT INTO users (
                auth_id
            ) VALUES (
                '${idToken.uid}'
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

// Authenticate that the request has come from the logged in user
// Returns the idToken's uid if valid. Firebase Admin SDK will throw an error if invalid
const authenticateRequest = async (reqIdToken: string): Promise<string> => {
    // Verify encoded id token passed from client (checks user has been signed in on the client side)
    const idToken = await fb.auth().verifyIdToken(reqIdToken);
    return idToken.uid;
}

// Get one by auth_id (will only return user data if the client is logged in with that user)
export const GET = (async (req, res) => {
    try {
        const uid = await authenticateRequest(req.params.idToken);

        // Get the user data from the db
        const { rows, rowCount } = await pool.query(`SELECT * FROM users WHERE auth_id = '${uid}'`);
        if (!rowCount) throw `Query returned no users with auth_id = '${uid}'`;
        res.status(200).json(rows[0]);
        
    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Update one by id
export const PATCH = (async (req, res) => {
    try {
        const uid = await authenticateRequest(req.params.idToken);
        const { rows, rowCount } = await pool.query(`SELECT * FROM users WHERE auth_id = '${uid}'`);

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
        const uid = await authenticateRequest(req.params.idToken);
        const { rowCount } = await pool.query(`DELETE FROM users WHERE auth_id = '${uid}'`);

        if (!rowCount) return res.status(404).send();

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;