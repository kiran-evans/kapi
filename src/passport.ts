import { pbkdf2Sync, timingSafeEqual } from 'crypto';
import dotenv from 'dotenv';
import { Strategy } from "passport-local";
import { User } from './controllers/User';
import { pool } from "./pg";

dotenv.config({
    path: '../.env'
});

const passwordIsValid = (enteredPw: string, hashedPw: Buffer, salt: Buffer) => {
    const hashedEnteredPw = pbkdf2Sync(enteredPw, salt, Number(process.env.ITERATIONS), Number(process.env.KEYLEN), String(process.env.DIGEST));
    return timingSafeEqual(hashedEnteredPw, hashedPw);
}

export const LocalStrategy = new Strategy(async (username, password, cb) => {    
    const { rows, rowCount }: { rows: User[], rowCount: number } = await pool.query(`SELECT * FROM users WHERE email = '${username}'`);
    if (!rowCount) return cb(null, false);

    const user = { ...rows[0] };

    if (!passwordIsValid(password, Buffer.from(user.hashed_pw, "hex"), Buffer.from(user.salt, "hex"))) return cb(null, false);

    const { hashed_pw, ...returnedBody } = user;
    
    return cb(null, returnedBody);
});