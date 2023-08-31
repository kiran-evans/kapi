import { Router } from "express";
import { body, param } from "express-validator";
import { DELETE, GET, PATCH } from "../controllers/orderController";

const router = Router();

// Routes using order id
const idRoute = router.route('/order/:id');
idRoute.get(GET);
idRoute.patch(
    param('id').notEmpty().isUUID(),
    body('paid').notEmpty().isBoolean(),
    PATCH
);
idRoute.delete(DELETE);

export default router;