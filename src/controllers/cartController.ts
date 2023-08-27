import { RequestHandler } from "express";
import { fb } from "../firebase";
import { addNewCartItemToDb, consolidateCarts } from "../lib/util";
import { User } from "../models/User";

// Combine carts of client and db (for when a user logs in on the client)
export const COMBINE = (async (req, res) => {
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

        const newCart = await consolidateCarts(user.cart_item_ids, req.body.items);
        
        const newCartItemIds = Array<string>();
        newCart.forEach(cartItem => {
            newCartItemIds.push(cartItem.id);
        });

        // Replace the user's cart in the db with the newly consolidated one
        await User.update({
            cart_item_ids: newCartItemIds
        }, {
            where: {
                id: user.id
            }
        });

        res.status(200).json(newCart);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Add/remove items (for when a user is browsing and adding/removing items on the client side)
export const UPDATE = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created and signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.params.idToken);

        // Replace the cart in the db with the cart received from the client
        const newCartItems = Array<string>();
        
        for (const clientCartItem of req.body.items) {
            newCartItems.push(await addNewCartItemToDb(clientCartItem));
        }        

        await pool.query(
            `UPDATE users SET
                cart_items=${toPgArray(newCartItems)}
                WHERE auth_id = '${idToken.uid}'
            `
        );

        // Get the items data from the db
        res.status(204).send();

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