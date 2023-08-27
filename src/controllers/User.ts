import dotenv from 'dotenv';
import { RequestHandler } from "express";
import { fb } from '../firebase';
import { User } from '../lib/model';
import { authenticateRequest } from '../lib/util';

dotenv.config({
    path: '../.env'
});

// Create new user
export const POST = (async (req, res) => {
    try {
        // Verify encoded id token passed from client (checks user has been created nad signed in on the client side)
        const idToken = await fb.auth().verifyIdToken(req.body.idToken);

        // Create the user if it doesn't exist
        await User.findOrCreate({
            where: {
                auth_id: idToken.uid
            },
            defaults: {
                auth_id: idToken.uid
            }
        });

        res.status(201).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Get one by auth_id (will only return user data if the client is logged in with that user)
export const GET = (async (req, res) => {
    try {
        const uid = await authenticateRequest(req.params.idToken);

        // Get the user data from the db
        const user = await User.findOne({
            where: {
                auth_id: uid
            }
        });
        
        if (!user) throw `Query returned no users with auth_id = '${uid}'`;
        res.status(200).json(user.toJSON());
        
    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;

// Delete one by id
export const DELETE = (async (req, res) => {
    try {
        const uid = await authenticateRequest(req.params.idToken);
        await User.destroy({
            where: {
                auth_id: uid
            },
            truncate: true
        });

        res.status(204).send();

    } catch (err: any) {
        console.error(err);
        res.status(500).send();
    }
}) satisfies RequestHandler;