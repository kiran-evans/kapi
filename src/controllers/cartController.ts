import { RequestHandler } from "express";
import { fb } from "../firebase";
import { addToCart } from "../lib/util";
import { CartItem } from "../models/CartItem";
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
        // // Payment has succeeded
        // // Find user's cart
        // // Verify encoded id token passed from client (checks user has been created and signed in on the client side)
        // const idToken = await fb.auth().verifyIdToken(req.params.idToken);
        // // Get the user data from the db
        // const userResult = await pool.query(`SELECT * FROM users WHERE auth_id = '${idToken.uid}'`);
        // if (!userResult.rowCount) throw `Query returned no users with auth_id = '${idToken.uid}'`;

        // const cartResult = await pool.query(`SELECT * FROM carts WHERE user_id = '${userResult.rows[0].id}'`);
        // if (!cartResult.rowCount) return res.status(404).send();
        
        // // Save cart items as an array of order_items (name, price, quantity)
        // let order_items = [];
        // for (const item of cartResult.rows[0].items) {
        //     order_items.push({
        //         name: item.name,
        //         price: item.price,
        //         quantity: item.quantity
        //     });
        // }
        
        // // Create a new order
        // await pool.query(
        //     `INSERT INTO orders (
        //         user_id,
        //         date_placed,
        //         items
        //     ) VALUES (
        //         '${cartResult.rows[0].user_id}',
        //         ${Date.now()},
        //         '${order_items}'
        //     )`
        // );
        
        // // Clear the user's cart
        // // await pool.query(
        // //     `INSERT INTO carts (
        // //         id,
        // //         items
        // //     ) VALUES (
        // //         gen_random_uuid(),
        // //         '{}'
        // //     )`
        // // );

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;