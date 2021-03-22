const { deployments } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

const { expect } = chai;

describe("NiftyA contract", async () => {
  beforeEach(async () => {
    await deployments.fixture();
  });

  it("mints a token to the owner", async function () {
    const { owner, alice, bob } = await getNamedAccounts();
    const niftyAInstance = await ethers.getContract("NiftyA", owner);
    const ownerBalance = await niftyAInstance.balanceOf(owner);

    expect(ownerBalance).to.equal(1);
  });
});
