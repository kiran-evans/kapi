import { Router } from "express";
import { CHECKOUT, GET, PATCH } from "../controllers/Cart";

const router = Router();

// Routes using cart id
const idRoute = router.route('/cart/:user_id');
idRoute.get(GET);
idRoute.patch(PATCH);

// Checkout route
const checkoutRoute = router.route('/checkout/:user_id');
checkoutRoute.post(CHECKOUT);

export default router;