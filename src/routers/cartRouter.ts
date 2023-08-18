import { Router } from "express";
import { body, param } from "express-validator";
import { CHECKOUT, GET, PATCH } from "../controllers/Cart";

const router = Router();

// Routes using cart id
const idRoute = router.route('/cart/:auth_id');
idRoute.get(
    param('user_id').notEmpty().isJWT(),
    GET
);
idRoute.patch(
    param('user_id').notEmpty().isJWT(),
    body('items').notEmpty().isArray(),
    PATCH
);

// Checkout route
const checkoutRoute = router.route('/checkout/:auth_id');
checkoutRoute.post(
    param('user_id').notEmpty().isJWT(),
    CHECKOUT
);

export default router;