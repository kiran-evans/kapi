import { RequestHandler } from "express";
import { pool } from "../pg";

import dotenv from 'dotenv';
dotenv.config({
    path: '../.env'
});

const pgArrayToJsArray = (pgArray: string): Array<any> => {
    const jsArray: any[] = [];

    return jsArray;
}

// Create new product
export const POST = (async (req, res) => {
    try {
        const products: Array<{
            name: string,
            description: string,
            price: number,
            categories: string[],
            sizes: string[],
            colours: string[]
        }> = req.body;

        products.forEach(async (product) => {
            await pool.query(
                `INSERT INTO products (
                    id,
                    name,
                    description,
                    price,
                    categories,
                    sizes,
                    colours
                ) VALUES (
                    gen_random_uuid(),
                    '${product.name}',
                    '${product.description}',
                    ${product.price - 0.01},
                    ARRAY[${product.categories}],
                    ARRAY[${product.sizes}],
                    ARRAY[${product.colours}]
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

        const productBody = { ...rows[0] };
        productBody.imageUrl = `${process.env.DOMAIN}/public/${productBody.name}.jpeg`;

        res.status(200).json(productBody);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;