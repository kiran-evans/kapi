import { RequestHandler } from "express";
import { pool } from "../pg";

// Get one by id
export const GET = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM products WHERE id = ${req.params.id}`);

        if (!rowCount) res.status(404).send();

        res.status(200).json(rows[0]);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get all
export const GET_ALL = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM products`);

        if (!rowCount) res.status(404).send();

        res.status(200).json(rows);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Create new product
export const POST = (async (req, res) => {
    try {
        const { name, description, price } = req.body;
        await pool.query(`INSERT INTO products (name, description, price) VALUES ('${name}', '${description}', ${price})`);

        res.status(201).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;