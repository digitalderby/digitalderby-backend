import { DEFAULT_WALLET } from '../config/globalsettings.js';
import { User } from '../models/User.js';
import { adminPasswordHash } from './secrets.js';

// Re-creates the admin user on startup.
export default async function CreateAdminUser() {
  console.log('Re-creating admin user...');
  await User.deleteOne({ username: 'admin' });

  const passwordHash = adminPasswordHash;

  await User.create({
    username: 'admin',
    passwordHash: passwordHash,
    profile: {
      bets: [],
      wallet: DEFAULT_WALLET,
      bankruptcies: 0,
    },
  });
}
