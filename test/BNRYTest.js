const { ZEPPELIN_LOCATION, ZERO_ADDRESS } = require("../helper.js");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WBNRY Token", function () {
  let WBNRYToken, wBNRYtoken, owner, recipient, anotherAccount;

  beforeEach(async function () {
    WBNRYToken = await ethers.getContractFactory("WBNRY");
    [owner, recipient, anotherAccount] = await ethers.getSigners();
    wBNRYtoken = await WBNRYToken.deploy();
    await wBNRYtoken.deployed();
  });

    describe('mint and burn', function () {
        it('mints', async function () {
            const totalSupplyBefore = await wBNRYtoken.totalSupply();
            expect(totalSupplyBefore).to.equal(0);
    
            // Mint new tokens
            const amountToMint = ethers.utils.parseEther('100'); // Mint 100 tokens
            await wBNRYtoken.connect(owner).mint(owner.address, amountToMint);
    
            // Check that the total supply increased by the correct amount
            const totalSupplyAfter = await wBNRYtoken.totalSupply();
            expect(totalSupplyAfter).to.equal(amountToMint);
        });
        
        it('burns', async function () {
            // Mint some tokens first
            const amountToMint = ethers.utils.parseEther('100'); // Mint 100 tokens
            await wBNRYtoken.connect(owner).mint(owner.address, amountToMint);

            // Burn the tokens
            const amountToBurn = ethers.utils.parseEther('50'); // Burn 50 tokens
            await wBNRYtoken.connect(owner).burn(amountToBurn);

            // Check that the total supply decreased by the correct amount
            const totalSupplyAfterBurn = await wBNRYtoken.totalSupply();
            expect(totalSupplyAfterBurn).to.equal(amountToMint.sub(amountToBurn));
        });
    });

});

describe("BNRY Ownership", function () {
    let WBNRYContract, wBNRYContract, owner, newOwner;
  
    beforeEach(async function () {
      WBNRYContract = await ethers.getContractFactory("WBNRY");
      [owner, newOwner] = await ethers.getSigners();
      wBNRYContract = await WBNRYContract.deploy();
      await wBNRYContract.deployed();
    });
  
    it('changes owner', async function () {
      // Check initial owner
      let ownerAddress = await owner.getAddress();
      let newOwnerAddress = await newOwner.getAddress();
      console.log(`owner address is: ${ownerAddress}`);
      console.log(`newOwner address is: ${newOwnerAddress}`);
      
      let currentOwner = await wBNRYContract.owner();
      console.log(`Current owner is: ${currentOwner}`);
      expect(currentOwner).to.equal(owner.address);
  
      // Transfer ownership
      await wBNRYContract.connect(owner).transferOwnership(newOwner.address);
  
      // Check pending owner
      let pendingOwner = await wBNRYContract.pendingOwner();
      expect(pendingOwner).to.equal(newOwner.address);
  
      // Claim ownership from new owner's side
      await wBNRYContract.connect(newOwner).claimOwnership();
  
      // Check new owner
      currentOwner = await wBNRYContract.owner();
      expect(currentOwner).to.equal(newOwner.address);
    });
  });
