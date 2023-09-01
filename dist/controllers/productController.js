"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.GET_ALL = exports.POST = void 0;
const Product_1 = require("../models/Product");
exports.POST = (async (req, res) => {
    try {
        const products = req.body;
        for (const product of products) {
            await Product_1.Product.create({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.GET_ALL = (async (req, res) => {
    try {
        const products = await Product_1.Product.findAll();
        res.status(200).json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.GET = (async (req, res) => {
    try {
        const product = await Product_1.Product.findByPk(req.params.id);
        if (!product)
            return res.status(404).send();
        res.status(200).json(product.toJSON());
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
