const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment...");

    const AINFT = await hre.ethers.getContractFactory("AINFT");
    console.log("Deploying AINFT...");
    
    const ainft = await AINFT.deploy();
    await ainft.waitForDeployment();
    
    const address = await ainft.getAddress();
    console.log("AINFT deployed to:", address);

    // Wait for a few block confirmations
    console.log("Waiting for confirmations...");
    await ainft.deploymentTransaction()?.wait(5);

    // Verify the contract
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });

    console.log("Contract verified successfully!");
    return address;
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });