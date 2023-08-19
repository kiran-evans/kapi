import { Router } from "express";
import { body, param } from 'express-validator';
import { DELETE, GET, POST } from "../controllers/User";

const router = Router();

// Default route
const route = router.route('/user');
route.post(
    body('idToken').notEmpty().isJWT(),
    POST
);

// Routes using JWT-encoded credentials
const authIdRoute = router.route('/user/:idToken');
authIdRoute.get(
    param('idToken').notEmpty().isJWT(),
    GET
);
authIdRoute.delete(
    param('idToken').notEmpty().isJWT(),
    DELETE
);

export default router;