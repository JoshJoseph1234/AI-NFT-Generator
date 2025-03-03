const axios = require('axios');
const FormData = require('form-data');

class PinataService {
  constructor() {
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
      throw new Error('Pinata API keys not configured');
    }
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_KEY;
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