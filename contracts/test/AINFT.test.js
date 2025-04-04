const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AINFT", function () {
  let AINFT;
  let ainft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    AINFT = await ethers.getContractFactory("AINFT");
    ainft = await AINFT.deploy();
    await ainft.waitForDeployment();
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
    const tokenURI = "https://example.com/token/1";

    it("Should mint a new NFT", async function () {
      const mintTx = await ainft.mintNFT(addr1.address, tokenURI);
      await mintTx.wait();

      expect(await ainft.ownerOf(1)).to.equal(addr1.address);
      expect(await ainft.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should increment token IDs", async function () {
      await ainft.mintNFT(addr1.address, tokenURI);
      await ainft.mintNFT(addr2.address, "https://example.com/token/2");

      expect(await ainft.ownerOf(1)).to.equal(addr1.address);
      expect(await ainft.ownerOf(2)).to.equal(addr2.address);
    });

    it("Should track user tokens", async function () {
      await ainft.mintNFT(addr1.address, tokenURI);
      await ainft.mintNFT(addr1.address, "https://example.com/token/2");

      const userTokens = await ainft.getUserTokens(addr1.address);
      expect(userTokens.length).to.equal(2);
      expect(userTokens[0]).to.equal(1);
      expect(userTokens[1]).to.equal(2);
    });
  });
});