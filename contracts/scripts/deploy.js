const hre = require("hardhat");

async function main() {
  try {
    console.log("\n---------------------");
    console.log("Starting deployment...");
    console.log("---------------------\n");

    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deployer address:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Get network
    const network = await hre.ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name);
    console.log("⛓️  Chain ID:", network.chainId);

    // Deploy contract
    console.log("\n📄 Deploying AINFT contract...");
    const AINFT = await hre.ethers.getContractFactory("AINFT");
    
    // Deploy with gas settings
    const ainft = await AINFT.deploy();
    console.log("⏳ Waiting for deployment transaction...");
    
    // Wait for contract deployment
    await ainft.waitForDeployment();
    const contractAddress = await ainft.getAddress();
    console.log("✅ Contract deployed to:", contractAddress);

    // Wait for confirmations
    console.log("\n⏳ Waiting for confirmations...");
    const deployTx = await ainft.deploymentTransaction();
    await deployTx.wait(5); // Wait for 5 block confirmations
    console.log("✅ Deployment confirmed!");

    // Verify on Etherscan
    if (process.env.ETHERSCAN_API_KEY) {
        console.log("\n🔍 Verifying contract on Etherscan...");
        try {
            await hre.run("verify:verify", {
                address: contractAddress,
                constructorArguments: []
            });
            console.log("✅ Contract verified successfully!");
        } catch (error) {
            console.log("❌ Verification error:", error.message);
        }
    }

    console.log("\n✨ Deployment completed!");
    console.log("Contract address:", contractAddress);
    return contractAddress;

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });