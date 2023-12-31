import { RequestHandler } from "express";
import { fb } from "../firebase";
import { addToCart } from "../lib/util";
import { CartItem } from "../models/CartItem";
import { Order, OrderItem } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";

// Combine carts of client and db (for when a user logs in on the client)
export const REPLACE_CART = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created and signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);
        // Get the user data from the db
        const [user, created] = await User.findOrCreate({
            where: {
                auth_id: idToken.uid
            },
            defaults: {
                auth_id: idToken.uid
            }
        });

        if (created) console.log(`[server] new user created because none was found`);        
        if (!user) throw `Failed to find or create user with auth_id=${idToken.uid}`;
        
        const newCartItemIds = Array<string>();
        req.body.items.forEach((cartItem: CartItem) => {
            newCartItemIds.push(cartItem.id);
        });

        // Replace the user's cart in the db with the newly consolidated one
        const [affectedCount, affectedRows] = await User.update({
            cart_item_ids: newCartItemIds
        }, {
            where: {
                id: user.id
            },
            returning: true
        });

        res.status(200).json(affectedRows[0].toJSON());

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Add/remove items (for when a user is browsing and adding/removing items on the client side)
export const ADD_TO_CART = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created and signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);
        // Get the user data from the db
        const user = await User.findOne({
            where: {
                auth_id: idToken.uid
            }
        });

        if (!user) return res.status(404).json(`No user found with auth_id=${idToken.uid}`);

        // Combine the existing cart in the db with the item in the request, handling duplicates where necessary
        const newCartItemIds = await addToCart(user.cart_item_ids, req.body.item);
        
        await User.update({
            cart_item_ids: newCartItemIds
        }, {
            where: {
                auth_id: idToken.uid
            }
        });

        // Send the updated list back to the client
        res.status(200).send(newCartItemIds);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get cart item
export const GET = (async (req, res) => {
    try {
        // Get a cart item and return it with its related product data
        const cartItem = await CartItem.findByPk(req.params.id);
        if (!cartItem) return res.status(404).send();

        const product = await Product.findByPk(cartItem.product_id);
        if (!product) return res.status(404).send();

        res.status(200).json({
            cartItemData: await cartItem.toJSON(),
            productData: await product.toJSON()
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Checkout
export const CHECKOUT = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created and signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);
        // Get the user data from the db
        const user = await User.findOne({
            where: {
                auth_id: idToken.uid
            }
        });
        if (!user) return res.status(404).send();

        const items = Array<OrderItem>();
        let total = 0;
        for (const cartItemId of user.cart_item_ids) {
            const cartItem = await CartItem.findByPk(cartItemId);
            if (!cartItem) return res.status(404).send();
            
            const product = await Product.findByPk(cartItem.product_id);
            if (!product) return res.status(404).send();
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
            unit_amount: total*100,
            currency: 'GBP'
        });

        const order = await Order.create({
            items: items,
            total: total
        });

        // Clear the user's cart and add the order to their list of orders
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

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;