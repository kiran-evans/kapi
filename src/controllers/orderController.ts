import { RequestHandler } from "express";
import { fb } from "../firebase";
import { Order } from "../models/Order";
import { User } from "../models/User";

// Get all orders for user id
export const GET = (async (req, res) => {
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

        const orders = Array<Order>();

        for (const orderId of user.order_ids) {
            const order = await Order.findByPk(orderId);
            if (!order) return res.status(404).send();

            orders.push(order);
        }

        res.status(200).json(orders);

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Update one by id
export const PATCH = (async (req, res) => {
    try {
        await Order.update({
            paid: req.body.paid
        }, {
            where: {
                id: req.params.id
            }
        });

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;