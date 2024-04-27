import { Handler, NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export async function loggedInAsUser(req: any, res: Response, next: NextFunction) {
    try {
        let token = req.get('Authorization') || req.query.token || req.body.token
        if (!token) { throw 'Not Logged In' }
        token = token.replace('Bearer ', '')

        const payload = jwt.verify(token, process.env.AUTH_SECRET || "")
        req.payload = payload
        next()
    } catch(error) {
        res.status(401).json('Must be logged in to perform this action')
    }
}

export async function loggedInAsAdmin(req: Request, res: Response, next: NextFunction) {
    next()
}


