import User from '../models/User.js';

async function getUserById(userId: string): Promise<any> {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}: ${error}`);
    throw error;
  }
}

class BettingWallet {
  private balance: number;

  constructor(private userId: string) {
    // Initialize balance from user profile
    this.balance = 0; // Initialize balance to 0
    this.initializeWallet();
  }

  private async initializeWallet(): Promise<void> {
    try {
      // Fetch user profile by user ID
      const userProfile = await getUserById(this.userId);

      // If user profile exists and has wallet data, initialize balance from it
      if (userProfile && userProfile.wallet && userProfile.wallet.balance) {
        this.balance = userProfile.wallet.balance;
      }
    } catch (error) {
      console.error(`Error initializing wallet for user ${this.userId}: ${error}`);
    }
  }

  public async getBalance(): Promise<number> {
    return this.balance;
  }

  public async placeBet(amount: number): Promise<boolean> {
    if (amount > this.balance) {
      console.log("Insufficient funds to place bet.");
      return false;
    } else {
      this.balance -= amount;
      console.log(`Bet placed for $${amount}. Remaining balance: $${this.balance}.`);
      await this.updateBalanceInProfile();
      return true;
    }
  }

  public async addWinnings(amount: number): Promise<void> {
    const doubledAmount = amount * 2; // Double the amount won
    this.balance += doubledAmount;
    console.log(`Winnings added: $${doubledAmount}. New balance: $${this.balance}.`);
    await this.updateBalanceInProfile();
  }

  private async updateBalanceInProfile(): Promise<void> {
    try {
      // Fetch latest user profile
      const userProfile = await getUserById(this.userId);

      // Update wallet balance in user profile
      userProfile.wallet.balance = this.balance;

      // Update user profile in the database
      await updateUser(this.userId, userProfile);
    } catch (error) {
      console.error(`Error updating wallet balance for user ${this.userId}: ${error}`);
    }
  }
}

export { BettingWallet };
