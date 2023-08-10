import { pbkdf2Sync } from 'crypto';
import dotenv from 'dotenv';
import { Strategy } from "passport-local";
import { pool } from "./pg";

dotenv.config({
    path: '../.env'
});

const passwordIsValid = (enteredPw: string, hashedPw: string, salt: string) => {
    const hashedEnteredPw = pbkdf2Sync(enteredPw, salt, Number(process.env.ITERATIONS), Number(process.env.KEYLEN), String(process.env.DIGEST)).toString("hex");
    return hashedPw === hashedEnteredPw;
}

export const LocalStrategy = new Strategy(async (enteredEmail, enteredPassword, cb) => {
    const { rows, rowCount } = await pool.query(`SELECT * FROM users WHERE email = '${enteredEmail}'`);
    if (!rowCount) return cb(null, false);

    const user = { ...rows[0] };

    if (!passwordIsValid(enteredPassword, user.hashedPw, user.salt)) return cb(null, false);

    const { password, ...returnedBody } = user;
    
    return cb(null, returnedBody);
});