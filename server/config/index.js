import dotenv from 'dotenv';
dotenv.config();

// Helper to extract clean env values (stripping key colons/spaces if any exist)
const getEnv = (key, defaultValue = '') => {
  return process.env[key] || process.env[key.trim()] || defaultValue;
};

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_KEY || process.env.JWT_SECRET || 'tichi_suraksha_super_secret_jwt_key_2026',
  emailService: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.EMAIL || process.env.SMTP_USER || '',
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
  },
  payu: {
    baseUrl: process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment',
    key: process.env.PAYU_TEST_KEY || process.env['PAYU_TEST_KEY '] || 'GKJE3Z',
    salt: process.env.payu_test_salt || process.env['payu_test_salt '] || '0zqiCnB4GslxAanSxjEAutWkWuggFiGs',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    serverBaseUrl: process.env.SERVER_BASE_URL || 'http://localhost:5000',
  },
};
