const ethers = require('ethers');
const AINFT = require('../../contracts/artifacts/contracts/AINFT.sol/AINFT.json');

class ContractService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      AINFT.abi,
      this.signer
    );
  }

  async mintNFT(recipientAddress, tokenURI) {
    try {
      const tx = await this.contract.mintNFT(recipientAddress, tokenURI);
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'NFTMinted');
      
      return {
        tokenId: event.args.tokenId.toString(),
        recipient: event.args.recipient,
        tokenURI: event.args.tokenURI
      };
    } catch (error) {
      console.error('Minting error:', error);
      throw new Error('Failed to mint NFT: ' + error.message);
    }
  }
}

module.exports = new ContractService();