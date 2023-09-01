import { Router } from "express";
import { body, param } from "express-validator";
import { GET, PATCH } from "../controllers/orderController";

const router = Router();

// Routes using order id
const idRoute = router.route('/order/:id');
idRoute.patch(
    param('id').notEmpty().isUUID(),
    body('paid').notEmpty().isBoolean(),
    PATCH
);

// Get a user's orders
const idTokenRoute = router.route('/order/:idToken');
idTokenRoute.get(
    param('idToken').notEmpty().isJWT(),
    GET
);

export default router;