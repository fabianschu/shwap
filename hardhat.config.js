require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.6",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    alice: {
      default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
    },
    bob: {
      default: 2, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
    },
  },
};
