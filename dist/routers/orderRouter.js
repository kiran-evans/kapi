"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
const idRoute = router.route('/order/:id');
idRoute.patch((0, express_validator_1.param)('id').notEmpty().isUUID(), (0, express_validator_1.body)('paid').notEmpty().isBoolean(), orderController_1.PATCH);
const idTokenRoute = router.route('/order/:idToken');
idTokenRoute.get((0, express_validator_1.param)('idToken').notEmpty().isJWT(), orderController_1.GET);
exports.default = router;
