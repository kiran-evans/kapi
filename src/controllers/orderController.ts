import { RequestHandler } from "express";
import { Order } from "../models/Order";

// Get one by id
export const GET = (async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) return res.status(404).send();

        res.status(200).json(order.toJSON());

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

// Delete one by id
export const DELETE = (async (req, res) => {
    try {
        await Order.destroy({
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