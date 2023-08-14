import dotenv from 'dotenv';
import { credential, initializeApp } from 'firebase-admin';

dotenv.config({ path: '../.env' });

export const fb = initializeApp({
    credential: credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});