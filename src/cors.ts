export default {
    credentials: true,
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_DEPLOYMENT_URL || 'http://localhost:5173',
    ]
}
