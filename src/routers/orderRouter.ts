import { Router } from "express";
import { DELETE, GET, PATCH } from "../controllers/Order";

const router = Router();

// Routes using order id
const idRoute = router.route('/order/:id');
idRoute.get(GET);
idRoute.patch(PATCH);
idRoute.delete(DELETE);

export default router;