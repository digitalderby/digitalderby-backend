import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

// Assuming you have defined the schema for your User model
import { User } from './models/User';

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a route to get the user's balance
app.get('/balance/:username', async (req: Request, res: Response) => {
    const username: string = req.params.username;

    try {
        // Assuming 'User' is the Mongoose model for user accounts
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ balance: user.balance });
    } catch (err) {
        console.error('Error fetching balance:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
