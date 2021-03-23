const { deployments } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

const { expect } = chai;

describe("Shwap contract", async () => {
  beforeEach(async () => {
    await deployments.fixture();
  });

  it("can get approval for itself", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const shwapInstance = await ethers.getContract("Shwap", owner.address);
    const niftyAInstance = await ethers.getContract("NiftyA", owner.address);

    // console.log(niftyAInstance.address);
    // console.log(shwapInstance.address);
    // console.log(owner.address);
    await shwapInstance.authorize(niftyAInstance.address, 1);
    // console.log(shwapInstance);
    // console.log(await niftyAInstance.balanceOf(owner.address));
    // await niftyAInstance.approve(alice.address, 1);
    // expect(await niftyAInstance.balanceOf(owner.address)).to.equal(1);
    // await niftyAInstance
    //   .connect(alice)
    //   .transferFrom(owner.address, bob.address, 1);

    // const bobBalance = await niftyAInstance.balanceOf(bob.address);
    // expect(bobBalance).to.equal(1);
    // expect(await niftyAInstance.ownerOf(1)).to.equal(bob.address);
  });
});
