import { Router } from "express";
import { GET } from "../controllers/Product";

const router = Router();
const route = router.route('/product');

route.get(GET);

export default router;