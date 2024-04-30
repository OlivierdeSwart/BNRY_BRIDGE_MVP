const { ZEPPELIN_LOCATION, ZERO_ADDRESS } = require("../helper.js");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("BurnableToken behavior", function () {
  let token;
  let owner, anotherAccount;
  let from;
  const initialBalance = ethers.utils.parseUnits("1000", 18); // Adjusting the decimal based on your token setup
  const amount = BigNumber.from(100);

  // beforeEach(async function () {
  //   BasicToken = await ethers.getContractFactory("WBNRY");
  //   [owner, recipient, anotherAccount] = await ethers.getSigners();
  //   basicToken = await BasicToken.deploy();
  //   await basicToken.deployed();
  // });

  beforeEach(async function () {
    [owner, anotherAccount] = await ethers.getSigners();
    // console.log(owner, anotherAccount);
    const Token = await ethers.getContractFactory("WBNRY");
    token = await Token.deploy();
    // console.log(token);

    await token.deployed();

    // Mint initial balance to the owner before tests
    await token.mint(owner.address, initialBalance);
    // console.log('mint successful')

    
    from = owner.address;
  });

  // describe("total supply", function () {
  //   it("returns the total amount of tokens", async function () {
  //     const totalSupply = await token.totalSupply();
  //     expect(totalSupply).to.equal(initialBalance);

  //     const from = owner.address;
  //     console.log(from);
  //   });
  // }); 

  describe('as a basic burnable token', function () {
    describe('when the sender is the token owner', function () {

      describe('when the given amount is not greater than balance of the sender', function () {

        beforeEach(async function () {
          const tx = await token.connect(owner).burn(amount);
          this.logs = await tx.wait();
        });

        it('burns the requested amount', async function () {
          const balance = await token.balanceOf(from);
          expect(balance).to.equal(initialBalance.sub(amount));
        });

        it('emits a burn event', async function () {
          const burnEvent = this.logs.events.find(
            event => event.event === 'Burn' && event.args.burner === owner.address && event.args.value.eq(amount)
          );
          expect(burnEvent).to.not.be.undefined;
        });

        it('emits a transfer event', async function () {
          const transferEvent = this.logs.events.find(
            event => event.event === 'Transfer' && event.args.from === owner.address && event.args.to === ZERO_ADDRESS && event.args.value.eq(amount)
          );
          expect(transferEvent).to.not.be.undefined;
        });
      });

      describe('when the given amount is greater than the balance of the sender', function () {
        const amount = initialBalance.add(1);

        it('reverts', async function () {
          await expect(token.connect(owner).burn(amount)).to.be.reverted;
        });
      });
    });

    describe('when the sender is not the token owner', function () {

      it('reverts', async function () {
        const from2 = anotherAccount.address;
        const amount = BigNumber.from(100);
        await expect(token.connect(anotherAccount).burn(amount)).to.be.reverted;
      });
    });
  });
});
