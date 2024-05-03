const { ZEPPELIN_LOCATION, ZERO_ADDRESS } = require("../helper.js");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("shouldBehaveLikeCanReclaimToken", function () {
  let token, owner, anotherAccount;
  const initialBalance = ethers.utils.parseUnits("1000", 8);
  const amount = BigNumber.from(100);

  beforeEach(async function () {
    [owner, anotherAccount, anotherAccount2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("WBNRY");
    token = await Token.deploy();

    await token.deployed();

    await token.mint(owner.address, initialBalance);
    await token.mint(token.address, initialBalance);
    
  });

  it('should allow owner to reclaim tokens', async function () {
    const ownerStartBalance = await token.balanceOf(owner.address);
    const tokenStartBalance = await token.balanceOf(token.address);
    // await token.connect(owner).reclaimToken(owner.address)
    await token.connect(owner).reclaimToken(token.address);
    // await token.reclaimToken(token.address);
    const ownerFinalBalance = await token.balanceOf(owner.address);
    const finalBalance = await token.balanceOf(token.address);
    expect(finalBalance, 0);
    expect(ownerFinalBalance).to.equal(ethers.utils.parseUnits("2000", 8));
  });

  it('should allow only owner to reclaim tokens', async function () {
    await expect(token.connect(anotherAccount2).reclaimToken(token.address)).to.be.reverted;
  });
});

