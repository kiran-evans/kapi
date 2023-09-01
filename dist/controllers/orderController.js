"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = exports.GET = void 0;
const firebase_1 = require("../firebase");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
exports.GET = (async (req, res) => {
    try {
        const idToken = await firebase_1.fb.auth().verifyIdToken(req.params.idToken);
        const user = await User_1.User.findOne({
            where: {
                auth_id: idToken.uid
            }
        });
        if (!user)
            return res.status(404).json(`No user found with auth_id=${idToken.uid}`);
        const orders = Array();
        for (const orderId of user.order_ids) {
            const order = await Order_1.Order.findByPk(orderId);
            if (!order)
                return res.status(404).send();
            orders.push(order);
        }
        res.status(200).json(orders);
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