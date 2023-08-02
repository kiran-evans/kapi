import { Router } from "express";
import { GET, GET_ALL, PATCH, POST } from "../controllers/Product";

const router = Router();

// Default route
const route = router.route('/product');
route.post(POST);
route.get(GET_ALL);

// Routes using product id
const idRoute = router.route('/product/:id');
idRoute.get(GET);
idRoute.patch(PATCH);

export default router;