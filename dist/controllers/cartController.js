"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECKOUT = exports.GET = exports.ADD_TO_CART = exports.REPLACE_CART = void 0;
const firebase_1 = require("../firebase");
const util_1 = require("../lib/util");
const CartItem_1 = require("../models/CartItem");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
exports.REPLACE_CART = (async (req, res) => {
    try {
        const idToken = await firebase_1.fb.auth().verifyIdToken(req.params.idToken);
        const [user, created] = await User_1.User.findOrCreate({
            where: {
                auth_id: idToken.uid
            },
            defaults: {
                auth_id: idToken.uid
            }
        });
        if (created)
            console.log(`[server] new user created because none was found`);
        if (!user)
            throw `Failed to find or create user with auth_id=${idToken.uid}`;
        const newCartItemIds = Array();
        req.body.items.forEach((cartItem) => {
            newCartItemIds.push(cartItem.id);
        });
        const [affectedCount, affectedRows] = await User_1.User.update({
            cart_item_ids: newCartItemIds
        }, {
            where: {
                id: user.id
            },
            returning: true
        });
        res.status(200).json(affectedRows[0].toJSON());
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.ADD_TO_CART = (async (req, res) => {
    try {
        const idToken = await firebase_1.fb.auth().verifyIdToken(req.params.idToken);
        const user = await User_1.User.findOne({
            where: {
                auth_id: idToken.uid
            }
        });
        if (!user)
            return res.status(404).json(`No user found with auth_id=${idToken.uid}`);
        const newCartItemIds = await (0, util_1.addToCart)(user.cart_item_ids, req.body.item);
        await User_1.User.update({
            cart_item_ids: newCartItemIds
        }, {
            where: {
                auth_id: idToken.uid
            }
        });
        res.status(200).send(newCartItemIds);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.GET = (async (req, res) => {
    try {
        const cartItem = await CartItem_1.CartItem.findByPk(req.params.id);
        if (!cartItem)
            return res.status(404).send();
        const product = await Product_1.Product.findByPk(cartItem.product_id);
        if (!product)
            return res.status(404).send();
        res.status(200).json({
            cartItemData: await cartItem.toJSON(),
            productData: await product.toJSON()
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.CHECKOUT = (async (req, res) => {
    try {
        const idToken = await firebase_1.fb.auth().verifyIdToken(req.params.idToken);
        const user = await User_1.User.findOne({
            where: {
                auth_id: idToken.uid
            }
        });
        if (!user)
            return res.status(404).send();
        const items = Array();
        let total = 0;
        for (const cartItemId of user.cart_item_ids) {
            const cartItem = await CartItem_1.CartItem.findByPk(cartItemId);
            if (!cartItem)
                return res.status(404).send();
            const product = await Product_1.Product.findByPk(cartItem.product_id);
            if (!product)
                return res.status(404).send();
            total += cartItem.quantity * product.price;
            items.push({
                name: product.name,
                quantity: cartItem.quantity,
                colour: cartItem.colour,
                size: cartItem.size,
                total: cartItem.quantity * product.price
            });
        }
        const stripe = require('stripe')(process.env.STRIPE_KEY);
        const product = await stripe.products.create({
            name: user.id
        });
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: total * 100,
            currency: 'GBP'
        });
        const order = await Order_1.Order.create({
            items: items,
            total: total
        });
        await user.update({
            cart_item_ids: [],
            order_ids: [...user.order_ids, order.id]
        });
        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/?payment_success=true&order_id=${order.id}`,
            cancel_url: `${process.env.CLIENT_URL}/?payment_success=false&order_id=${order.id}`
        });
        res.status(200).json({ url: checkoutSession.url });
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
