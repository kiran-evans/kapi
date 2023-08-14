import dotenv from 'dotenv';
import firebase from 'firebase-admin';

dotenv.config({ path: '../.env' });

export const fb = firebase.initializeApp({
    credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});