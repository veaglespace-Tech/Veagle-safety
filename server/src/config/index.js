import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:Root@localhost:3306/veagle_safety',
  jwtSecret: process.env.JWT_SECRET || process.env.JWT_KEY || 'BC3h5NMVj2f6TuUT',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  serverBaseUrl: process.env.SERVER_BASE_URL || 'http://localhost:5000',
  
  // PayU Test Mode Credentials
  payu: {
    merchantKey: process.env.PAYU_MERCHANT_KEY || 'GKJE3Z',
    merchantSalt: process.env.PAYU_MERCHANT_SALT || '0zqiCnB4GslxAanSxjEAutWkWuggFiGs',
    baseUrl: process.env.PAYU_BASE_URL || 'https://test.payu.in/_payment',
  },

  // Email Configuration
  email: {
    user: process.env.EMAIL || 'abhijeet.veaglespace@gmail.com',
    pass: process.env.EMAIL_PASS || 'olkpfpodnlrsnkdi',
  },

  // Email Service fallback alias for backwards compatibility
  emailService: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.EMAIL || 'abhijeet.veaglespace@gmail.com',
    pass: process.env.EMAIL_PASS || 'olkpfpodnlrsnkdi',
  },

  // ImageKit Configuration
  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_AAS2evQ3M2ce2T2uoJ95Ml5Yb6g=',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_5Ldo1lg2JaJoczmuFYp1rKCOSrk=',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/m5ei0wbuw',
  },
};
