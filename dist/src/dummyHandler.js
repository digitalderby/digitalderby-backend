export default async function dummyRouter(req, res, next) {
    res.json({ endpoint: req.baseUrl });
}
