import express, { Request, Response } from "express";

const app = express();

// Set the time when betting closes
const bettingCloseTime: Date = new Date(Date.now() + 2 * 60 * 1000); // Betting closes in 2 minutes

// Route to get the time remaining until betting closes
app.get("/timer", (req: Request, res: Response): void => {
  const currentTime: Date = new Date();
  const timeRemaining: number = Math.floor(
    (bettingCloseTime.getTime() - currentTime.getTime()) / 1000
  ); // Convert milliseconds to seconds

  // Return the time remaining in seconds
  res.json({ timeRemaining });
});

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
