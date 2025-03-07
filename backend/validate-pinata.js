require('dotenv').config();

function validatePinataConfig() {
  console.log('\n🔍 Validating Pinata Configuration...');
  
  const { PINATA_API_KEY, PINATA_SECRET_KEY } = process.env;
  
  if (!PINATA_API_KEY) {
    console.error('❌ PINATA_API_KEY is missing in .env file');
    return false;
  }
  
  if (!PINATA_SECRET_KEY) {
    console.error('❌ PINATA_SECRET_KEY is missing in .env file');
    return false;
  }
  
  if (PINATA_API_KEY === 'your_pinata_api_key_here') {
    console.error('❌ PINATA_API_KEY is not updated with actual value');
    return false;
  }
  
  if (PINATA_SECRET_KEY === 'your_pinata_secret_key_here') {
    console.error('❌ PINATA_SECRET_KEY is not updated with actual value');
    return false;
  }
  
  console.log('✅ Pinata configuration looks valid');
  return true;
}

validatePinataConfig();