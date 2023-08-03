import { Router } from "express";
import { AUTH, DELETE, PATCH, POST } from "../controllers/User";

const router = Router();

// Default route
const route = router.route('/user');
route.post(POST);

// Routes using user id
const idRoute = router.route('/user/:id');
idRoute.patch(PATCH);
idRoute.delete(DELETE);

// Auth route
const authRoute = router.route('/auth');
authRoute.post(AUTH);

export default router;