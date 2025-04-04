const hre = require("hardhat");

async function main() {
  console.log("Checking environment configuration...");

  // Check environment variables
  console.log("\nEnvironment Variables:");
  console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY ? "✓ Set" : "✗ Missing");
  console.log("ALCHEMY_API_KEY:", process.env.ALCHEMY_API_KEY ? "✓ Set" : "✗ Missing");
  console.log("ETHERSCAN_API_KEY:", process.env.ETHERSCAN_API_KEY ? "✓ Set" : "✗ Missing");

  // Check network configuration
  console.log("\nNetwork Configuration:");
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);

  // Check account balance
  const [signer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("\nAccount Information:");
  console.log("Address:", signer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error checking environment:", error);
    process.exit(1);
  });