import { RequestHandler } from "express";
import { pool } from "../pg";

// Get one by user_id
export const GET = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM carts WHERE user_id = ${req.params.user_id}`);

        if (!rowCount) return res.status(404).send();

        res.status(200).json(rows[0]);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Update one by user_id
export const PATCH = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM carts WHERE user_id = ${req.params.user_id}`);

        if (!rowCount) return res.status(404).send();

        let newBody = { ...rows[0] };
        
        for (const key in req.body) {
            if (newBody[key] !== req.body[key]) {
                newBody[key] = req.body[key];
            }
        }

        await pool.query(
            `UPDATE carts SET
                name='${newBody.name}',
                description='${newBody.description}',
                price='${newBody.price}'
                WHERE user_id = ${req.params.user_id}
            `)

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Checkout
export const CHECKOUT = (async (req, res) => {
    try {
        // Payment has succeeded
        // Find user's cart
        const { rows, rowCount } = await pool.query(`SELECT * FROM carts WHERE user_id = ${req.params.user_id}`);
        if (!rowCount) return res.status(404).send();
        
        // Save cart items as an array of order_items (name, price, quantity)
        let order_items = [];
        for (const item of rows[0].items) {
            order_items.push({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            });
        }
        
        // Create a new order
        await pool.query(
            `INSERT INTO orders (
                id,
                user_id,
                date_placed,
                items
            ) VALUES (
                gen_random_uuid(),
                '${rows[0].user_id}',
                ${Date.now()},
                '${order_items}'
            )`);
        
        // Clear the user's cart
        await pool.query(
            `INSERT INTO carts (
                id,
                items
            ) VALUES (
                gen_random_uuid(),
                '{}'
            )`);

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;