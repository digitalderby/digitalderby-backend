import GameLog from "../models/GameLog.js";
import { BetInfo } from "../game/betInfo.js";
import { GameServer } from "../game/gameServer.js";

async function commitGame(this: GameServer): Promise<void> {
  console.log("Writing game results to database...");
  if (this.race === null || this.raceStates === null) {
    return;
  }
  // Create a new GameLog object in the database
  const game = await GameLog.create({
    horses: this.race.horses.map((h: { spec: { _id: any } }) => h.spec._id),
    results: {
      rankings: this.raceStates[this.raceStates.length - 1].rankings,
    },
  });
  console.log("Successfully wrote game log to database ");

  // For each bet, create a new BetInfo object and associate it with the game ID
  await Promise.all(
    [...this.bets.values()].map(async (bet) => {
      await bet.commit(game._id);
    })
  );
}

// Extend the BetInfo interface to include the commit method
declare module "../game/betInfo.js" {
    interface BetInfo {
        commit(gameId: ObjectId | string): Promise<void>;
    }
}

// Implement the commit method for the BetInfo class
BetInfo.prototype.commit = async function (
    this: BetInfo,
    gameId: ObjectId | string
): Promise<void> {
    // Populate the bet log with the user ID, game ID, and horse ID
    await BetInfo.create({
        username: this.username,
        gameId: gameId,
        _horseId: this.horseId,
        get horseId() {
            return this._horseId;
        },
        set horseId(value) {
            this._horseId = value;
        },
        betValue: this.betValue,
        returns: this.returns,
    });
};
