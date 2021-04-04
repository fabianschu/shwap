const { deployments } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

const { expect } = chai;

describe("Specs: Shwap contract", async () => {
  let owner, alice, bob;
  let shwapInstance;
  let niftyAInstance;

  beforeEach(async () => {
    await deployments.fixture();
  });

  describe("#transfer", async () => {
    describe("with approval", async () => {
      beforeEach(async () => {
        [owner, alice] = await ethers.getSigners();
        shwapInstance = await ethers.getContract("Shwap", owner.address);
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
});
