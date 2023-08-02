import { Router } from "express";
import { GET, PATCH } from "../controllers/Cart";

const router = Router();

// Routes using cart id
const idRoute = router.route('/cart/:user_id');
idRoute.get(GET);
idRoute.patch(PATCH);

export default router;