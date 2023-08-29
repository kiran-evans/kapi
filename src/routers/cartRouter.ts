import { Router } from "express";
import { body, param } from "express-validator";
import { CHECKOUT, COMBINE, UPDATE } from "../controllers/cartController";

const router = Router();

// Routes using user idToken
const idRoute = router.route('/cart/:idToken');
idRoute.patch(
    param('idToken').notEmpty().isJWT(),
    body('items').notEmpty().isArray(),
    COMBINE
);
idRoute.put(
    param('idToken').notEmpty().isJWT(),
    body('items').notEmpty().isArray(),
    UPDATE
)

// Checkout route
const checkoutRoute = router.route('/checkout/:idToken');
checkoutRoute.post(
    param('idToken').notEmpty().isJWT(),
    CHECKOUT
);

export default router;