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
    const { owner } = await getNamedAccounts();
    const niftyAInstance = await ethers.getContract("NiftyA", owner);
    const ownerBalance = await niftyAInstance.balanceOf(owner);

    expect(ownerBalance).to.equal(1);
  });

  it("can transfer ownership from owner to alice to bob", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const niftyAInstance = await ethers.getContract("NiftyA", owner.address);
    await niftyAInstance.transferFrom(owner.address, alice.address, 1);
    await niftyAInstance
      .connect(alice)
      .transferFrom(alice.address, bob.address, 1);
    const bobBalance = await niftyAInstance.balanceOf(bob.address);
    expect(bobBalance).to.equal(1);
    expect(await niftyAInstance.ownerOf(1)).to.equal(bob.address);
  });

  it("emits an event when alice gets approved", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const niftyAInstance = await ethers.getContract("NiftyA", owner.address);
    await expect(niftyAInstance.approve(alice.address, 1)).to.emit(
      niftyAInstance,
      "Approval"
    );
  });

  it("lets owner authorize alice to transfer", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const niftyAInstance = await ethers.getContract("NiftyA", owner.address);
    await niftyAInstance.approve(alice.address, 1);
    expect(await niftyAInstance.balanceOf(owner.address)).to.equal(1);
    await niftyAInstance
      .connect(alice)
      .transferFrom(owner.address, bob.address, 1);

    const bobBalance = await niftyAInstance.balanceOf(bob.address);
    expect(bobBalance).to.equal(1);
    expect(await niftyAInstance.ownerOf(1)).to.equal(bob.address);
  });
});
