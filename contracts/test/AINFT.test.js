const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AINFT", function () {
  let ainft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const AINFT = await ethers.getContractFactory("AINFT");
    ainft = await AINFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ainft.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await ainft.name()).to.equal("AI NFT Collection");
      expect(await ainft.symbol()).to.equal("AINFT");
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      const tokenURI = "ipfs://QmTest";
      await ainft.mintNFT(addr1.address, tokenURI);
      
      expect(await ainft.ownerOf(1)).to.equal(addr1.address);
      expect(await ainft.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should increment token IDs", async function () {
      await ainft.mintNFT(addr1.address, "ipfs://QmTest1");
      await ainft.mintNFT(addr1.address, "ipfs://QmTest2");
      
      expect(await ainft.totalSupply()).to.equal(2);
    });

    it("Should only allow owner to mint", async function () {
      const tokenURI = "ipfs://QmTest";
      
      // Try to mint from non-owner account
      await expect(
        ainft.connect(addr1).mintNFT(addr2.address, tokenURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});