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
    [owner, alice, bob] = await ethers.getSigners();
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

  describe("#acceptProposal", async () => {
    beforeEach(async () => {
      niftyAInstance = await ethers.getContract("NiftyA", owner.address);
      niftyBInstance = await ethers.getContract("NiftyB", alice.address);
    });

    describe("without proposals", async () => {
      it("reverts transaction", async () => {
        const acceptProposal = shwapInstance.connect(alice).acceptProposal(0);
        await expect(acceptProposal).to.be.revertedWith(
          "No proposals available"
        );
      });
    });

    describe("with nonexistent index", async () => {
      it("reverts transaction", async () => {
        addProposal = await shwapInstance.addProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        const acceptProposal = shwapInstance.connect(alice).acceptProposal(4);
        await expect(acceptProposal).to.be.revertedWith("Index does not exist");
      });
    });

    describe("without approvals", async () => {
      it("reverts transaction", async () => {
        addProposal = await shwapInstance.addProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        const acceptProposal = shwapInstance.connect(alice).acceptProposal(0);
        await expect(acceptProposal).to.be.revertedWith(
          "Insufficient approvals"
        );
      });
    });

    describe("with caller not being the counterpart", async () => {
      it("reverts transaction", async () => {
        addProposal = await shwapInstance.addProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        const acceptProposal = shwapInstance.connect(bob).acceptProposal(0);
        await expect(acceptProposal).to.be.revertedWith("Not authorized");
      });
    });

    describe("with all approvals and valid ownership", async () => {
      let acceptProposal;

      beforeEach(async () => {
        await niftyAInstance.approve(shwapInstance.address, 1);
        await niftyBInstance.connect(alice).approve(shwapInstance.address, 2);
        addProposal = await shwapInstance.addProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        addSecondProposal = await shwapInstance
          .connect(alice)
          .addProposal(niftyBInstance.address, niftyAInstance.address, 2, 666);
        acceptProposal = await shwapInstance.connect(alice).acceptProposal(0);
      });

      it("transfers ownership of NiftyA to Alice", async () => {
        expect(await niftyAInstance.balanceOf(alice.address)).to.equal(1);
      });

      it("transfers ownership of NiftyB to Owner", async () => {
        expect(await niftyBInstance.balanceOf(owner.address)).to.equal(1);
      });

      it("moves last proposal to id of successful swap", async () => {
        [
          proposerAddress,
          proposerTokenAddress,
          counterpartTokenAddress,
          proposerTokenId,
          counterpartTokenId,
        ] = await shwapInstance.proposals(0);
        expect(BigNumber.from(counterpartTokenId)).to.be.equal(
          BigNumber.from(666)
        );
      });

      it("removes last proposal", async () => {
        [proposerAddress] = await shwapInstance.proposals(1);
        expect(BigNumber.from(proposerAddress)).to.be.equal(BigNumber.from(0));
      });

      it("emits an event IndexChange", async () => {
        expect(acceptProposal)
          .to.emit(shwapInstance, "IndexChange")
          .withArgs(1, 0);
      });

      it("decrements the number of proposals", async () => {
        expect(await shwapInstance.numberProposals()).to.be.equal(1);
      });
    });
  });

  describe("#_isOwner", async () => {
    beforeEach(async () => {
      niftyAInstance = await ethers.getContract("NiftyA", owner.address);
      niftyBInstance = await ethers.getContract("NiftyB", alice.address);
      await shwapInstance.addProposal(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
    });

    it("when caller is owner of counterpart token, emits OwnershipConfirmation event", async () => {
      const isOwner = await shwapInstance
        .connect(alice)
        ._isOwner(niftyBInstance.address, 2);
      expect(isOwner).to.emit(shwapInstance, "OwnershipConfirmation");
    });

    it("when NOT owner, doesn't emit OwnershipConfirmation event", async () => {
      const isOwner = await shwapInstance
        .connect(owner)
        ._isOwner(niftyBInstance.address, 2);
      expect(isOwner).not.to.emit(shwapInstance, "OwnershipConfirmation");
    });
  });

  describe("#_isApproved", async () => {
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

  describe("#_isAllApproved", async () => {
    beforeEach(async () => {
      niftyAInstance = await ethers.getContract("NiftyA", owner.address);
      niftyBInstance = await ethers.getContract("NiftyB", alice.address);
    });

    it("with all approvals emits AllApprovalConfirmation event", async () => {
      await niftyAInstance.approve(shwapInstance.address, 1);
      await niftyBInstance.approve(shwapInstance.address, 2);
      const isAllApproved = await shwapInstance._isAllApproved(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
      expect(isAllApproved).to.emit(shwapInstance, "AllApprovalConfirmation");
    });

    it("with only one approval doesn't emit AllApprovalConfirmation event", async () => {
      await niftyBInstance.approve(shwapInstance.address, 2);
      const isAllApproved = await shwapInstance._isAllApproved(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
      expect(isAllApproved).not.to.emit(
        shwapInstance,
        "AllApprovalConfirmation"
      );
    });

    it("without approval doesnt emit event", async () => {
      const isAllApproved = await shwapInstance._isAllApproved(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
      expect(isAllApproved).not.to.emit(
        shwapInstance,
        "AllApprovalConfirmation"
      );
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

    it("increments the numberProposals", async () => {
      const nextId = await shwapInstance.numberProposals();
      expect(BigNumber.from(nextId)).to.be.equal(BigNumber.from(1));
    });

    it("emits an event", async () => {
      expect(addProposal)
        .to.emit(shwapInstance, "ProposalAdded")
        .withArgs(
          1,
          owner.address,
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
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
