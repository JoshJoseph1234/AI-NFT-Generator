require('dotenv').config();
const pinataService = require('./utils/pinataService');

async function testPinata() {
  try {
    console.log('\n🧪 Testing Pinata functionality...');

    // Test image URL
    const testImageUrl = 'https://picsum.photos/200/300';
    
    // Step 1: Upload image
    console.log('\n📤 Step 1: Uploading image to Pinata...');
    const ipfsImageUrl = await pinataService.uploadImage(testImageUrl);
    console.log('✅ Image uploaded successfully!');
    console.log('📋 IPFS Image URL:', ipfsImageUrl);

    // Step 2: Upload metadata
    console.log('\n📤 Step 2: Uploading metadata...');
    const metadata = {
      name: 'Test NFT',
      description: 'Testing Pinata upload functionality',
      image: ipfsImageUrl,
      attributes: [
        {
          trait_type: 'Test Type',
          value: 'Pinata Test'
        }
      ]
    };

    const metadataUrl = await pinataService.uploadMetadata(metadata);
    console.log('✅ Metadata uploaded successfully!');
    console.log('📋 Metadata URL:', metadataUrl);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

testPinata();