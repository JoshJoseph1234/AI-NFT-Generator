require('dotenv').config();

function validateEnv() {
  const required = {
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error(`- ${key}`));
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
}

module.exports = validateEnv;