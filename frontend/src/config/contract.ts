import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const CONTRACT_ABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)",
  "function getUserTokens(address user) public view returns (uint256[])",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event NFTMinted(uint256 indexed tokenId, address indexed recipient, string tokenURI)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const getContract = (signer: ethers.Signer) => {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};