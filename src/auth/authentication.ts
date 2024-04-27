import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

// Get the admin password from the environment and hash it

export async function loggedInAsUser(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.get('Authorization') || req.query.token || req.body.token
        if (!token) { throw 'Not Logged In' }
        token = token.replace('Bearer ', '')

        const payload = jwt.verify(token, process.env.AUTH_SECRET || "secret")
        req.body.jwtPayload = payload
        next()
    } catch(error) {
        res.status(401).json('Must be logged in to perform this action')
    }
}

export async function loggedInAsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.get('Authorization') || req.query.token || req.body.token
        if (!token) { throw 'Not Logged In' }
        token = token.replace('Bearer ', '')

        const payload = jwt.verify(token, process.env.AUTH_SECRET || "secret")
        if (typeof payload === 'string') {
            return res.status(401).json('Could not parse token')
        }
        if (payload.isAdmin === true) {
            req.body.isAdmin = true
        } else {
            return res.status(401).json('Ill-formed token')
        }
        next()
    } catch(error) {
        res.status(401).json('Must be logged in to perform this action')
    }
}


