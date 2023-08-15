import { RequestHandler } from "express";
import { pool } from "../pg";

import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});

// Create new product
export const POST = (async (req, res) => {
    try {
        const products: Array<{
            name: string,
            description: string,
            price: number
        }> = req.body;

        products.forEach(async (product) => {
            await pool.query(
                `INSERT INTO products (
                    name,
                    description,
                    price
                ) VALUES (
                    '${product.name}',
                    '${product.description}',
                    ${product.price - 0.01}
                )`);
        })

        res.status(201).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get all
export const GET_ALL = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM products`);

        const products = [...rows];
        rows.forEach(product => {
            product.imageUrl = `${process.env.DOMAIN}/public/${product.name}.jpeg`
        });

        if (!rowCount) return res.status(404).send();

        res.status(200).json(products);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get one by id
export const GET = (async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query(`SELECT * FROM products WHERE id = ${req.params.id}`);

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
        const { rows, rowCount } = await pool.query(`SELECT * FROM products WHERE id = ${req.params.id}`);

        if (!rowCount) return res.status(404).send();

        let newBody = { ...rows[0] };
        
        for (const key in req.body) {
            if (newBody[key] !== req.body[key]) {
                newBody[key] = req.body[key];
            }
        }

        await pool.query(
            `UPDATE products SET
                name='${newBody.name}',
                description='${newBody.description}',
                price='${newBody.price}'
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
        const { rowCount } = await pool.query(`DELETE FROM products WHERE id = ${req.params.id}`);

        if (!rowCount) return res.status(404).send();

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;