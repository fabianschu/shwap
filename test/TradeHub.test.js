const { deployments } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("@ethersproject/bignumber");

chai.use(solidity);

const { expect } = chai;

const setupTokens = async () => {
  const [owner, alice, bob] = await ethers.getSigners();

  const niftyAInstance = await ethers.getContract("NiftyA", owner.address);
  const niftyBInstance = await ethers.getContract("NiftyB", owner.address);

  await niftyAInstance.mint(owner.address, 1);
  await niftyBInstance.mint(alice.address, 2);

  return {
    niftyAInstance,
    niftyBInstance,
  };
};

const setupTest = deployments.createFixture(
  async ({ deployments, ethers }, options) => {
    await deployments.fixture();
    const [owner, alice, bob] = await ethers.getSigners();

    const { niftyAInstance, niftyBInstance } = await setupTokens();

    const tradeHubInstance = await ethers.getContract(
      "TestTradeHub",
      owner.address
    );

    return {
      users: { owner, alice, bob },
      contractInstances: { tradeHubInstance, niftyAInstance, niftyBInstance },
    };
  }
);

describe("Specs: TestTradeHub contract", async () => {
  let owner, alice, bob;
  let tradeHubInstance;
  let niftyAInstance;
  let niftyBInstance;

  beforeEach(async () => {
    ({
      users: { owner, alice, bob },
      contractInstances: { tradeHubInstance, niftyAInstance, niftyBInstance },
    } = await setupTest());
  });

  describe("#transfer", async () => {
    describe("with approval", async () => {
      beforeEach(async () => {
        await niftyAInstance.approve(tradeHubInstance.address, 1);
      });

      it("transfers ownership from owner to alice", async () => {
        await tradeHubInstance._transfer(
          niftyAInstance.address,
          owner.address,
          alice.address,
          1
        );
        expect(await niftyAInstance.balanceOf(alice.address)).to.equal(1);
      });

      it("event is emitted in ERC721 contract", async () => {
        await expect(
          tradeHubInstance._transfer(
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
    let listProposal;
    let acceptProposal;
    let listSecondProposal;
    let proposerAddress,
      proposerTokenAddress,
      counterpartTokenAddress,
      proposerTokenId,
      counterpartTokenId;

    describe("without proposals", async () => {
      it("reverts transaction", async () => {
        acceptProposal = tradeHubInstance.connect(alice).acceptProposal(0);
        await expect(acceptProposal).to.be.revertedWith(
          "No proposals available"
        );
      });
    });

    describe("with nonexistent index", async () => {
      it("reverts transaction", async () => {
        listProposal = await tradeHubInstance.listProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        const acceptProposal = tradeHubInstance
          .connect(alice)
          .acceptProposal(4);
        await expect(acceptProposal).to.be.revertedWith("Index does not exist");
      });
    });

    describe("without approvals", async () => {
      it("reverts transaction", async () => {
        listProposal = await tradeHubInstance.listProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        acceptProposal = tradeHubInstance.connect(alice).acceptProposal(0);
        await expect(acceptProposal).to.be.revertedWith(
          "Insufficient approvals"
        );
      });
    });

    describe("with caller not being the counterpart", async () => {
      it("reverts transaction", async () => {
        listProposal = await tradeHubInstance.listProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
        acceptProposal = tradeHubInstance.connect(bob).acceptProposal(0);
        await expect(acceptProposal).to.be.revertedWith("Not authorized");
      });
    });

    describe("with all approvals and valid ownership", async () => {
      let counterpartTokenId;

      beforeEach(async () => {
        await niftyAInstance.approve(tradeHubInstance.address, 1);
        await niftyBInstance
          .connect(alice)
          .approve(tradeHubInstance.address, 2);
      });

      describe("with specified counterpartTokenId", () => {
        counterpartTokenId = 2;

        beforeEach(async () => {
          listProposal = await tradeHubInstance.listProposal(
            niftyAInstance.address,
            niftyBInstance.address,
            1,
            counterpartTokenId
          );
          acceptProposal = await tradeHubInstance
            .connect(alice)
            .acceptProposal(0);
        });

        it("transfers ownership of NiftyA to Alice", async () => {
          expect(await niftyAInstance.balanceOf(alice.address)).to.equal(1);
        });

        it("transfers ownership of NiftyB to Owner", async () => {
          expect(await niftyBInstance.balanceOf(owner.address)).to.equal(1);
        });
      });

      describe("with multiple proposals available", () => {
        counterpartTokenId = 2;

        beforeEach(async () => {
          await niftyBInstance.mint(alice.address, 666);
          await niftyBInstance
            .connect(alice)
            .approve(tradeHubInstance.address, 666);
          listProposal = await tradeHubInstance.listProposal(
            niftyAInstance.address,
            niftyBInstance.address,
            1,
            counterpartTokenId
          );
          listSecondProposal = await tradeHubInstance
            .connect(alice)
            .listProposal(
              niftyBInstance.address,
              niftyAInstance.address,
              2,
              666
            );
          acceptProposal = await tradeHubInstance
            .connect(alice)
            .acceptProposal(0);
        });

        it("moves last proposal to id of successful swap", async () => {
          [
            proposerAddress,
            proposerTokenAddress,
            counterpartTokenAddress,
            proposerTokenId,
            counterpartTokenId,
          ] = await tradeHubInstance.proposals(0);
          expect(BigNumber.from(counterpartTokenId)).to.be.equal(
            BigNumber.from(666)
          );
        });

        it("removes last proposal", async () => {
          [proposerAddress] = await tradeHubInstance.proposals(1);
          expect(BigNumber.from(proposerAddress)).to.be.equal(
            BigNumber.from(0)
          );
        });

        it("emits an event IndexChange", async () => {
          expect(acceptProposal)
            .to.emit(tradeHubInstance, "IndexChange")
            .withArgs(1, 0);
        });

        it("decrements the number of proposals", async () => {
          expect(await tradeHubInstance.numberProposals()).to.be.equal(1);
        });
      });
    });
  });

  describe("#listProposal", async () => {
    let proposerAddress,
      proposerTokenAddress,
      counterpartTokenAddress,
      proposerTokenId,
      counterpartTokenId,
      listProposal;

    describe("caller is NOT owner of proposed token", async () => {
      beforeEach(async () => {
        listProposal = tradeHubInstance
          .connect(alice)
          .listProposal(niftyAInstance.address, niftyBInstance.address, 1, 2);
      });

      it("reverts the transaction", async () => {
        await expect(listProposal).to.be.revertedWith(
          "Proposer must be owner of proposed token"
        );
      });
    });

    describe("caller is owner of proposed token", async () => {
      beforeEach(async () => {
        listProposal = await tradeHubInstance.listProposal(
          niftyAInstance.address,
          niftyBInstance.address,
          1,
          2
        );
      });

      it("increments the numberProposals", async () => {
        const nextId = await tradeHubInstance.numberProposals();
        expect(BigNumber.from(nextId)).to.be.equal(BigNumber.from(1));
      });

      it("emits an event", async () => {
        expect(listProposal)
          .to.emit(tradeHubInstance, "ProposalAdded")
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
          ] = await tradeHubInstance.proposals(0);
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
          expect(BigNumber.from(proposerTokenId)).to.be.equal(
            BigNumber.from(1)
          );
        });

        it("counterpartTokenId is 2", async () => {
          expect(BigNumber.from(counterpartTokenId)).to.be.equal(
            BigNumber.from(2)
          );
        });
      });
    });
  });

  describe("#delistProposal", async () => {
    let delistProposal;

    beforeEach(async () => {
      await tradeHubInstance.listProposal(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
    });

    describe("caller is NOT owner of proposed token", async () => {
      beforeEach(async () => {
        delistProposal = tradeHubInstance.connect(alice).delistProposal(0);
      });

      it("reverts the transaction", async () => {
        await expect(delistProposal).to.be.revertedWith(
          "You are not the owner of the proposed token"
        );
      });
    });

    describe("caller is owner of proposed token", async () => {
      beforeEach(async () => {
        await tradeHubInstance.delistProposal(0);
      });

      it("proposerAddress is address of owner", async () => {
        const proposal = await tradeHubInstance.proposals(0);
        expect(proposal.exists).to.equal(false);
      });
    });
  });

  describe("#_isOwner", async () => {
    beforeEach(async () => {
      await tradeHubInstance.listProposal(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
    });

    it("when caller is owner of counterpart token, emits OwnershipConfirmation event", async () => {
      const isOwner = await tradeHubInstance
        .connect(alice)
        ._isOwner(niftyBInstance.address, 2);
      expect(isOwner).to.emit(tradeHubInstance, "OwnershipConfirmation");
    });

    it("when NOT owner, doesn't emit OwnershipConfirmation event", async () => {
      const isOwner = await tradeHubInstance
        .connect(owner)
        ._isOwner(niftyBInstance.address, 2);
      expect(isOwner).not.to.emit(tradeHubInstance, "OwnershipConfirmation");
    });
  });

  describe("#_isApproved", async () => {
    it("with approval emits ApprovalConfirmation event", async () => {
      await niftyAInstance.approve(tradeHubInstance.address, 1);
      const isApproved = await tradeHubInstance._isApproved(
        niftyAInstance.address,
        1
      );
      expect(isApproved).to.emit(tradeHubInstance, "ApprovalConfirmation");
    });

    it("without approval doesnt emit event", async () => {
      const isApproved = await tradeHubInstance._isApproved(
        niftyAInstance.address,
        1
      );
      expect(isApproved).not.to.emit(tradeHubInstance, "ApprovalConfirmation");
    });
  });

  describe("#_isAllApproved", async () => {
    it("with all approvals emits AllApprovalConfirmation event", async () => {
      await niftyAInstance.approve(tradeHubInstance.address, 1);
      await niftyBInstance.connect(alice).approve(tradeHubInstance.address, 2);
      const isAllApproved = await tradeHubInstance._isAllApproved(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
      expect(isAllApproved).to.emit(
        tradeHubInstance,
        "AllApprovalConfirmation"
      );
    });

    it("with only one approval doesn't emit AllApprovalConfirmation event", async () => {
      await niftyBInstance.connect(alice).approve(tradeHubInstance.address, 2);
      const isAllApproved = await tradeHubInstance._isAllApproved(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
      expect(isAllApproved).not.to.emit(
        tradeHubInstance,
        "AllApprovalConfirmation"
      );
    });

    it("without approval doesnt emit event", async () => {
      const isAllApproved = await tradeHubInstance._isAllApproved(
        niftyAInstance.address,
        niftyBInstance.address,
        1,
        2
      );
      expect(isAllApproved).not.to.emit(
        tradeHubInstance,
        "AllApprovalConfirmation"
      );
    });
  });
});
