import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

// PM2 can start the backend with either the repository root or server folder
// as its cwd. Load the known env locations without replacing values injected
// by the process manager, and ignore blank entries in an earlier file.
const serverDir = fileURLToPath(new URL('../..', import.meta.url));
const repoDir = path.dirname(serverDir);
const envFiles = [
  path.join(serverDir, '.env'),
  path.join(repoDir, '.env'),
  path.join(process.cwd(), '.env'),
];

for (const envFile of [...new Set(envFiles)]) {
  if (!fs.existsSync(envFile)) continue;
  const parsed = dotenv.parse(fs.readFileSync(envFile));
  for (const [key, value] of Object.entries(parsed)) {
    if (value && !process.env[key]) process.env[key] = value;
  }
}

// Helper to extract clean env values
const getEnv = (key, defaultValue = '') => {
  return process.env[key] || process.env[key.trim()] || defaultValue;
};

const jwtSecretValue = process.env.JWT_KEY || process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'tichi_suraksha_super_secret_jwt_key_2026' : undefined);

if (process.env.NODE_ENV === 'production' && !jwtSecretValue) {
  throw new Error('FATAL ERROR: JWT_SECRET or JWT_KEY is not defined in the environment variables.');
}

export const config = {
  port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 5002 : 5000),
  jwtSecret: jwtSecretValue,
  jwt: {
    secret: jwtSecretValue,
    expiresIn: '30d',
  },
  emailService: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
    secure: process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : true,
    user: process.env.EMAIL || process.env.SMTP_USER || '',
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
    backupAccountsRaw: process.env.SMTP_BACKUP_ACCOUNTS || '',
  },
  razorpay: {
    keyId: getEnv('RAZORPAY_KEY_ID'),
    keySecret: getEnv('RAZORPAY_KEY_SECRET'),
    clientUrl: process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? 'https://sakhisuraksha.veaglespace.com' : 'http://localhost:3000'),
    serverBaseUrl: process.env.SERVER_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://sakhisuraksha.veaglespace.com' : 'http://localhost:5000'),
  },
};
