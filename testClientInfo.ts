// Modify the implementation of ClientInfo to include wallet properties and methods
class ClientInfo {
  socket: Socket;
  authed: boolean;
  username: string;
  wallet: number;

  constructor(socket: Socket, authed: boolean, username: string, initialWallet: number) {
      this.socket = socket;
      this.authed = authed;
      this.username = username;
      this.wallet = initialWallet;
  }

  // Method to update wallet balance asynchronously
  async updateWallet(amount: number): Promise<void> {
      try {
          // Perform asynchronous operations here if needed
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Example asynchronous operation
          this.wallet += amount;
      } catch (error) {
          console.error('Error updating wallet:', error);
          // Optionally, you can throw the error to propagate it to the caller
          throw error;
      }
  }

  // Method to get wallet balance
  getWallet(): number {
      return this.wallet;
  }
}
