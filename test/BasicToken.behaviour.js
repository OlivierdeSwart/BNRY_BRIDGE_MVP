const { ZEPPELIN_LOCATION, ZERO_ADDRESS } = require("../helper.js");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicToken", function () {
  let BasicToken, basicToken, owner, recipient, anotherAccount;

  beforeEach(async function () {
    BasicToken = await ethers.getContractFactory("WBNRY");
    [owner, recipient, anotherAccount] = await ethers.getSigners();
    basicToken = await BasicToken.deploy();
    await basicToken.deployed();
  });

  describe('total supply', function () {
    it('returns the total amount of tokens', async function () {
      const totalSupply = await basicToken.totalSupply();
      expect(totalSupply).to.equal(0);
    });
  });

  describe('balanceOf', function () {
    describe('when the requested account has no tokens', function () {
      it('returns zero', async function () {
        const balance = await basicToken.balanceOf(anotherAccount.address);
        expect(balance).to.equal(0);
      });
    });

    describe('when the requested account has some tokens', function () {
      it('returns the total amount of tokens', async function () {
        const balance = await basicToken.balanceOf(owner.address);
        expect(balance).to.equal(0);
      });
    });
  });

  describe('transfer', function () {
    describe('when the recipient is not the zero address', function () {
      describe('when the sender does not have enough balance', function () {
        const amount = 101;

        it('reverts', async function () {
          await expect(basicToken.connect(owner).transfer(recipient.address, amount)).to.be.reverted;
        });
      });

      describe('when the sender has enough balance', function () {
        const amount = ethers.utils.parseUnits("100", 8);

        it('transfers the requested amount', async function () {

          // Mint some tokens to the owner's account
          const initialSupply = ethers.utils.parseUnits("100", 8); // 100 tokens
          await basicToken.mint(owner.address, initialSupply);

          const ownerBalanceBefore = await basicToken.balanceOf(owner.address);
          console.log(`owner balance before: ${ownerBalanceBefore}`);

          await basicToken.connect(owner).transfer(recipient.address, amount);

          const senderBalance = await basicToken.balanceOf(owner.address);
          expect(senderBalance).to.equal(0);

          const recipientBalance = await basicToken.balanceOf(recipient.address);
          expect(recipientBalance).to.equal(amount);
        });

        it('emits a transfer event', async function () {

          // Mint some tokens to the owner's account
          const initialSupply = ethers.utils.parseUnits("100", 8); // 100 tokens
          await basicToken.mint(owner.address, initialSupply);

          await expect(basicToken.connect(owner).transfer(recipient.address, amount))
            .to.emit(basicToken, 'Transfer')
            .withArgs(owner.address, recipient.address, amount);
        });
      });
    });

    describe('when the recipient is the zero address', function () {

      it('reverts', async function () {

        // Mint some tokens to the owner's account
        const initialSupply = ethers.utils.parseUnits("100", 8); // 100 tokens
        await basicToken.mint(owner.address, initialSupply);
        
        await expect(basicToken.connect(owner).transfer(ZERO_ADDRESS, 100)).to.be.reverted;
      });
    });
  });
});
