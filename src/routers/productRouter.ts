import { Router } from "express";
import { GET } from "../controllers/Product";

const router = Router();
const route = router.route('/product/:id');
const allRoute = router.route('/product/all');

route.get(GET);

export default router;