import { Router } from "express";
import { body, param } from 'express-validator';
import { DELETE, LOGIN, PATCH, POST } from "../controllers/User";

const router = Router();

// Default route
const route = router.route('/user');
route.post(
    body('email').trim().notEmpty().isEmail(),
    body('password').notEmpty().isAlphanumeric().isLength({ min: 10 }),
    POST
);

// Routes using user id
const idRoute = router.route('/user/:id');
idRoute.patch(
    param('id').notEmpty().isAlphanumeric(),
    body('email').trim().notEmpty().isEmail(),
    body('password').notEmpty().isAlphanumeric().isLength({ min: 10 }),
    PATCH
);
idRoute.delete(DELETE, param('id').notEmpty().isAlphanumeric());

// Login route
const loginRoute = router.route('/login');
loginRoute.post(
    body('idToken').notEmpty().isJWT(),
    LOGIN
);

export default router;