import { Router } from "express";
import { body, param } from 'express-validator';
import { AUTH, DELETE, PATCH, POST } from "../controllers/User";

const router = Router();

// Default route
const route = router.route('/user');
route.post(POST,
    body('email').trim().notEmpty().isEmail(),
    body('password').notEmpty().isAlphanumeric().isLength({ min: 10 })
);

// Routes using user id
const idRoute = router.route('/user/:id');
idRoute.patch(PATCH,
    param('id').notEmpty().isAlphanumeric(),
    body('email').trim().notEmpty().isEmail(),
    body('password').notEmpty().isAlphanumeric().isLength({ min: 10 })
);
idRoute.delete(DELETE, param('id').notEmpty().isAlphanumeric());

// Auth route
const authRoute = router.route('/auth');
authRoute.post(AUTH);

export default router;