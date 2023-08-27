import dotenv from 'dotenv';
import { RequestHandler } from "express";
import { Product } from "../lib/model";
dotenv.config({
    path: '../.env'
});

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

        for (const product of products) {
            await Product.create({
                name: product.name,
                description: product.description,
                price: product.price,
                img_url: `${process.env.DOMAIN}/public/${product.name}.jpeg`,
                categories: product.categories,
                sizes: product.sizes,
                colours: product.colours
            });
        }

        res.status(201).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get all
export const GET_ALL = (async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).json(products);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get one by id
export const GET = (async (req, res) => {
    try {
        const product = await Product.findByPk(req.body.id);

        if (!product) return res.status(404).send();

        res.status(200).json(product.toJSON());

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;