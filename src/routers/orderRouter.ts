import { Router } from "express";
import { DELETE, GET, PATCH, POST } from "../controllers/Order";

const router = Router();

// Default route
const route = router.route('/order');
route.post(POST);

// Routes using order id
const idRoute = router.route('/order/:id');
idRoute.get(GET);
idRoute.patch(PATCH);
idRoute.delete(DELETE);

export default router;