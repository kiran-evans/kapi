"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.GET = exports.POST = void 0;
const firebase_1 = require("../firebase");
const util_1 = require("../lib/util");
const User_1 = require("../models/User");
exports.POST = (async (req, res) => {
    try {
        const idToken = await firebase_1.fb.auth().verifyIdToken(req.body.idToken);
        await User_1.User.findOrCreate({
            where: {
                auth_id: idToken.uid
            },
            defaults: {
                auth_id: idToken.uid
            }
        });
        res.status(201).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.GET = (async (req, res) => {
    try {
        const uid = await (0, util_1.authenticateRequest)(req.params.idToken);
        const user = await User_1.User.findOne({
            where: {
                auth_id: uid
            }
        });
        if (!user)
            throw `Query returned no users with auth_id = '${uid}'`;
        res.status(200).json(user.toJSON());
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
exports.DELETE = (async (req, res) => {
    try {
        const uid = await (0, util_1.authenticateRequest)(req.params.idToken);
        await User_1.User.destroy({
            where: {
                auth_id: uid
            },
            truncate: true
        });
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
