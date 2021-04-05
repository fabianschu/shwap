const { deployments } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("@ethersproject/bignumber");

chai.use(solidity);

const { expect } = chai;

describe("Specs: TestShwap contract", async () => {
  let owner, alice, bob;
  let shwapInstance;
  let niftyAInstance;
  let niftyBInstance;

  beforeEach(async () => {
    await deployments.fixture();
    [owner, alice] = await ethers.getSigners();
    shwapInstance = await ethers.getContract("TestShwap", owner.address);
  });

  describe("#transfer", async () => {
    describe("with approval", async () => {
      beforeEach(async () => {
        niftyAInstance = await ethers.getContract("NiftyA", owner.address);
        await niftyAInstance.approve(shwapInstance.address, 1);
      });

      it("ownership transferred from owner to alice", async () => {
        await shwapInstance._transfer(
          niftyAInstance.address,
          owner.address,
          alice.address,
          1
        );
        expect(await niftyAInstance.balanceOf(alice.address)).to.equal(1);
      });

      it("event is emitted in ERC721 contract", async () => {
        await expect(
          shwapInstance._transfer(
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

  describe("#isApproved", async () => {
    it("with approval emits ApprovalConfirmation event", async () => {
      niftyAInstance = await ethers.getContract("NiftyA", owner.address);
      await niftyAInstance.approve(shwapInstance.address, 1);
      const isApproved = await shwapInstance._isApproved(
        niftyAInstance.address,
        1
      );
      expect(isApproved).to.emit(shwapInstance, "ApprovalConfirmation");
    });

    it("without approval doesnt emit event", async () => {
      const isApproved = await shwapInstance._isApproved(
        niftyAInstance.address,
        1
      );
      expect(isApproved).not.to.emit(shwapInstance, "ApprovalConfirmation");
    });
  });

  describe("#addProposal", async () => {
    let proposerAddress,
      proposerTokenAddress,
      counterpartTokenAddress,
      proposerTokenId,
      counterpartTokenId,
      addProposal;

    beforeEach(async () => {
      niftyAInstance = await ethers.getContract("NiftyA", owner.address);
      niftyBInstance = await ethers.getContract("NiftyB", owner.address);
      addProposal = await shwapInstance.addProposal(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
    });

    it("increments the idCounter", async () => {
      const nextId = await shwapInstance.idCounter();
      expect(BigNumber.from(nextId)).to.be.equal(BigNumber.from(1));
    });

    it("emits an event", async () => {
      expect(addProposal).to.emit(shwapInstance, "ProposalEvent");
    });

    describe("data storage", async () => {
      beforeEach(async () => {
        [
          proposerAddress,
          proposerTokenAddress,
          counterpartTokenAddress,
          proposerTokenId,
          counterpartTokenId,
        ] = await shwapInstance.proposals(0);
      });

      it("proposerAddress is address of owner", async () => {
        expect(proposerAddress).to.equal(owner.address);
      });

      it("proposerTokenAddress is address of NiftyA", async () => {
        expect(proposerTokenAddress).to.equal(niftyAInstance.address);
      });

      it("counterpartTokenAddress is address of NiftyB", async () => {
        expect(counterpartTokenAddress).to.equal(niftyBInstance.address);
      });

      it("proposerTokenId is 1", async () => {
        expect(BigNumber.from(proposerTokenId)).to.be.equal(BigNumber.from(1));
      });

      it("counterpartTokenId is 2", async () => {
        expect(BigNumber.from(counterpartTokenId)).to.be.equal(
          BigNumber.from(2)
        );
      });
    });
  });
});
