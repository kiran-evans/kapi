import { Router } from "express";
import { body, param } from "express-validator";
import { ADD_TO_CART, CHECKOUT, REPLACE_CART } from "../controllers/cartController";

const router = Router();

// Routes using user idToken
const idRoute = router.route('/cart/:idToken');
idRoute.put(
    param('idToken').notEmpty().isJWT(),
    body('items').notEmpty().isArray(),
    REPLACE_CART
);
idRoute.patch(
    param('idToken').notEmpty().isJWT(),
    body('item').notEmpty().isObject(),
    ADD_TO_CART
)

// Checkout route
const checkoutRoute = router.route('/checkout/:idToken');
checkoutRoute.post(
    param('idToken').notEmpty().isJWT(),
    CHECKOUT
);

export default router;