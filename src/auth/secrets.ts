import { saltPassword } from './password.js';

if (process.env.AUTH_SECRET === undefined) {
  console.log(
    "JWT authentication secret is undefined --- setting it to 'secret'. Please define this in production!",
  );
}

export const jwtSecret = process.env.AUTH_SECRET || 'secret';

if (process.env.ADMIN_PASSWORD === undefined) {
  console.log(
    "Admin password is undefined --- setting it to 'admin'. Please define this in production!",
  );
}

const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
export const adminPasswordHash = await saltPassword(adminPassword);
