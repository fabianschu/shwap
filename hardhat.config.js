require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: {
    compilers: [{ version: "0.8.4" }],
  },
  networks: {
    hardhat: {
      mining: {
        // auto: false,
        // interval: 5000,
        chainId: 1337,
      },
    },
  },
  namedAccounts: {
    owner: {
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
