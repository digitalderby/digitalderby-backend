import { Handler, Request, Response } from 'express'

export default async function dummyRouter(req: Request, res: Response, next: Handler) {
    res.json({endpoint: req.baseUrl})
}
