import express, { Request, Response } from 'express';
import { BetInfo } from '../game/betInfo.js';

const router = express.Router();

// Route to retrieve bet information for a user
router.get('/bet-info/:username', async (req: Request, res: Response) => {
    // Extract username from request parameters
    const username: string = req.params.username;

    try {
        // Find bet information for the specified user
        const betInfo = await BetInfo.findOne({ username });

        // If no bet information found, return 404 error
        if (!betInfo) {
            return res.status(404).json({ error: 'Bet information not found for the user' });
        }

        // Return bet information as JSON 
        res.json(betInfo);
    } catch (err) {
        // Handle errors
        console.error('Error fetching bet information:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
