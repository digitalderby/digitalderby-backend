import jwt from 'jsonwebtoken';
import { jwtSecret } from "./secrets.js";
import { deletedUsers } from "./tokens.js";
// Get the admin password from the environment and hash it
export async function loggedInAsUser(req, res, next) {
    try {
        let token = req.get('Authorization') || req.query.token || req.body.token;
        if (!token) {
            throw 'Not Logged In';
        }
        token = token.replace('Bearer ', '');
        const payload = jwt.verify(token, jwtSecret);
        if (typeof payload === 'string') {
            return res.status(400).json('Could not parse token');
        }
        if (!deletedUsers.has(payload.username)) {
            return res.status(400).json('Cannot be logged in as deleted user');
        }
        req.body.jwtPayload = payload;
        next();
    }
    catch (error) {
        res.status(401).json('Must be logged in to perform this action');
    }
}
export async function loggedInAsAdmin(req, res, next) {
    try {
        let token = req.get('Authorization') || req.query.token || req.body.token;
        if (!token) {
            throw 'Not Logged In';
        }
        token = token.replace('Bearer ', '');
        const payload = jwt.verify(token, jwtSecret || "secret");
        if (typeof payload === 'string') {
            return res.status(401).json('Could not parse token');
        }
        if (payload.isAdmin === true) {
            req.body.isAdmin = true;
        }
        else {
            return res.status(401).json('Ill-formed token');
        }
        next();
    }
    catch (error) {
        res.status(401).json('Must be logged in as the admin to perform this action');
    }
}
