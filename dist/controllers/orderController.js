"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.PATCH = exports.GET = void 0;
const Order_1 = require("../models/Order");
exports.GET = (async (req, res) => {
    try {
        const order = await Order_1.Order.findByPk(req.params.id);
        if (!order)
            return res.status(404).send();
        res.status(200).json(order.toJSON());
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.PATCH = (async (req, res) => {
    try {
        await Order_1.Order.update({
            paid: req.body.paid
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.DELETE = (async (req, res) => {
    try {
        await Order_1.Order.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
