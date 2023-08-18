import { RequestHandler } from "express";
import { fb } from "../firebase";
import { toPgArray } from "../lib/util";
import { pool } from "../pg";

// Combine carts of client and db (for when a user logs in on the client)
export const COMBINE = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created nad signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);

        const { rows, rowCount } = await pool.query(`SELECT * FROM carts WHERE user_id = '${idToken.uid}'`);

        if (!rowCount) return res.status(404).send();

        // Combine items from the client with the items from the db
        const updatedCartResult = await pool.query(
            `UPDATE carts SET
                items=${toPgArray([...rows[0].items, ...req.body.items])}
                WHERE user_id = '${req.params.user_id}'
                RETURNING items
            `
        );

        res.status(200).json(updatedCartResult.rows[0]);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Add/remove items (for when a user is browsing and adding/removing items on the client side)
export const UPDATE = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created nad signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);

        const { rows, rowCount } = await pool.query(`SELECT * FROM carts WHERE user_id = '${idToken.uid}'`);

        if (!rowCount) return res.status(404).send();

        // Replace the cart in the db with the cart received from the client
        const updatedCartResult = await pool.query(
            `UPDATE carts SET
                items=${toPgArray([...rows[0].items, ...req.body.items])}
                WHERE user_id = '${req.params.user_id}'
                RETURNING items
            `
        );

        res.status(200).json(updatedCartResult.rows[0]);

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
        // Verify encoded id token passed from client (checks user has been created nad signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);

        const { rows, rowCount } = await pool.query(`SELECT * FROM carts WHERE user_id = '${idToken.uid}'`);
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
            )`
        );
        
        // Clear the user's cart
        await pool.query(
            `INSERT INTO carts (
                id,
                items
            ) VALUES (
                gen_random_uuid(),
                '{}'
            )`
        );

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;