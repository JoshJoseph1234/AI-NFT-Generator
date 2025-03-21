import { ethers } from "ethers";

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Update ABI to include all functions
export const CONTRACT_ABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function getUserTokens(address user) public view returns (uint256[] memory)",
  "function getUserTokenURIs(address user) public view returns (string[] memory)",
  "function totalSupply() public view returns (uint256)",
  "event NFTMinted(uint256 tokenId, address recipient, string tokenURI)"
];

export const getContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not configured");
  }
  console.log("Creating contract instance with address:", CONTRACT_ADDRESS);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};