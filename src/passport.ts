import { pbkdf2Sync } from 'crypto';
import { Strategy } from "passport-local";
import { pool } from "./pg";

const passwordIsValid = (enteredPw: string, hashedPw: string, salt: string) => {
    const hashedEnteredPw = pbkdf2Sync(enteredPw, salt, 10000, 64, 'sha512').toString("hex");
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