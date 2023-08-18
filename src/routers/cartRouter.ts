import { Router } from "express";
import { body, param } from "express-validator";
import { CHECKOUT, COMBINE, UPDATE } from "../controllers/Cart";

const router = Router();

// Routes using cart id
const idRoute = router.route('/cart/:auth_id');
idRoute.patch(
    param('user_id').notEmpty().isJWT(),
    body('items').notEmpty().isArray(),
    COMBINE
);
idRoute.put(
    param('user_id').notEmpty().isJWT(),
    body('items').notEmpty().isArray(),
    UPDATE
)

// Checkout route
const checkoutRoute = router.route('/checkout/:auth_id');
checkoutRoute.post(
    param('user_id').notEmpty().isJWT(),
    CHECKOUT
);

export default router;