import { Router } from "express";
import { GET, GET_ALL, POST } from "../controllers/Product";

const router = Router();

// Default route
const route = router.route('/product');
route.get(GET_ALL);
route.post(POST);

// Routes using product id
const idRoute = router.route('/product/:id');
idRoute.get(GET);

export default router;