const chai = require("chai");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

const { expect } = chai;

describe("NiftyA contract", async () => {
  it("mints a token to Alice", async function () {
    const [owner, alice, bob] = await ethers.getSigners();
    const niftyA = await ethers.getContractFactory("NiftyA");
    const niftyAInstance = await niftyA.deploy();
    await niftyAInstance._mint(alice.address, 1);
    expect(await niftyAInstance.balanceOf(alice.address)).to.equal(1);
  });
});
