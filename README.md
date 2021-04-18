# Shwifty
A decentralized App running on Ethereum to enable actors to exchange ERC721 tokens for other ERC721 tokens in a non-custodial fashion. The app consists (or will consist, since it is work in progress) of three parts:
  - Smart Contract: to facilitate the actual exchange
  - Node backend: to store some additional data, such as past exchanges of a user etc.
  - React frontend: to interact with the Smart Contract as well as the backend 

# Hardhat

## Run tests
`npx hardhat test`

## Start local hardhat node
`npx hardhat node`
Runs in the background.

## Hardhat console
`npx hardhat console --network localhost`
New terminal: connect to network via console

### Some commands

#### Accounts
```js
await hre.getNamedAccounts();
```

#### Contract Interaction
```js
const contractInstance = await ethers.getContract('contractName')
```
