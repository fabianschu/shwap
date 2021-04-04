const { deployments } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("@ethersproject/bignumber");

chai.use(solidity);

const { expect } = chai;

describe("Specs: Shwap contract", async () => {
  let owner, alice, bob;
  let shwapInstance;
  let niftyAInstance;
  let niftyBInstance;

  beforeEach(async () => {
    await deployments.fixture();
    [owner, alice] = await ethers.getSigners();
    shwapInstance = await ethers.getContract("Shwap", owner.address);
  });

  describe("#transfer", async () => {
    describe("with approval", async () => {
      beforeEach(async () => {
        niftyAInstance = await ethers.getContract("NiftyA", owner.address);
        await niftyAInstance.approve(shwapInstance.address, 1);
      });

      it("ownership transferred from owner to alice", async () => {
        await shwapInstance.transfer(
          niftyAInstance.address,
          owner.address,
          alice.address,
          1
        );
        expect(await niftyAInstance.balanceOf(alice.address)).to.equal(1);
      });

      it("event is emitted in ERC721 contract", async () => {
        await expect(
          shwapInstance.transfer(
            niftyAInstance.address,
            owner.address,
            alice.address,
            1
          )
        )
          .to.emit(niftyAInstance, "Transfer")
          .withArgs(owner.address, alice.address, 1);
      });
    });
  });

  describe("#addProposal", async () => {
    beforeEach(async () => {
      niftyAInstance = await ethers.getContract("NiftyA", owner.address);
      niftyBInstance = await ethers.getContract("NiftyB", owner.address);
      await shwapInstance.addProposal(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
    });

    it("increments the idCounter", async () => {
      const id = await shwapInstance.idCounter();
      expect(BigNumber.from(id)).to.be.equal(BigNumber.from(1));
    });
  });
});
