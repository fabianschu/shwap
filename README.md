# Hardhat
## Start local hardhat node
`npx hardhat node`
Runs in the background.

## Hardhat console
`npx hardhat console --network localhost`
New terminal: connect to network via console

### Accounts
```js
await hre.getNamedAccounts();
```

### Contract Interaction
```js
const contractInstance = await ethers.getContract('contractName')
```

# Setup local geth client

Create local database & accounts (only once)
`geth init ./genesis.json --datadir ./chaindata`

Start local blockchain
`geth --datadir ./chaindata --nodiscover`

# Run tests
`npx hardhat test`

# IPC via console

Attach to ipc (separate terminal)
`geth attach ./chaindata/geth.ipc`

## Commands

### Mining
start mining:
`miner.start(1)`

stop mining:
`miner.stop()`

### Accounts
get all addresses:
`eth.accounts`

create new accuont with password
`personal.newAccount("12345678");`

address to which mining awards are transferred
`eth.coinbase`

set coinbase
`miner.setEtherbase(eth.accounts[0]);`

start miner
`miner.start(1);`

get account balance
`eth.getBalance(accounts[0]);`

get balance in ether
`web3.fromWei(eth.getBalance(eth.accounts[0]), "ether");`
