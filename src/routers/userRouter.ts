import { Router } from "express";
import { DELETE, GET, PATCH, POST } from "../controllers/User";

const router = Router();

// Default route
const route = router.route('/user');
route.post(POST);

// Routes using user id
const idRoute = router.route('/user/:id');
idRoute.get(GET);
idRoute.patch(PATCH);
idRoute.delete(DELETE);

export default router;