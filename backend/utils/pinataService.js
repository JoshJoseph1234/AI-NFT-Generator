const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

class PinataService {
  constructor() {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_KEY;

    if (!apiKey || !secretKey) {
      console.error('Missing Pinata API keys in environment variables:');
      console.error('PINATA_API_KEY:', apiKey ? 'Set' : 'Missing');
      console.error('PINATA_SECRET_KEY:', secretKey ? 'Set' : 'Missing');
      throw new Error('Pinata API keys not configured');
    }

    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  async uploadImage(imageUrl) {
    try {
      console.log('Downloading image from:', imageUrl);
      
      // Download image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(imageResponse.data);

      // Create form data
      const formData = new FormData();
      formData.append('file', buffer, {
        filename: 'nft-image.jpg',
        contentType: 'image/jpeg',
      });

      console.log('Uploading to Pinata...');
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.secretKey,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error('Pinata Upload Error:', error.response?.data || error.message);
      throw new Error('Failed to upload to Pinata: ' + (error.response?.data?.message || error.message));
    }
  }

  async uploadMetadata(metadata) {
    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.secretKey,
          },
        }
      );

      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Metadata Upload Error:', error.response?.data || error.message);
      throw new Error('Failed to upload metadata: ' + (error.response?.data?.message || error.message));
    }
  }
}

module.exports = new PinataService();