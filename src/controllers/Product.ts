import { RequestHandler } from "express";
import { pool } from "../pg";

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