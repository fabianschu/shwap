import ethers from "ethers";

const EthersInstance = new ethers.providers.WebSocketProvider(
  "ws://localhost:1234"
);

export default EthersInstance;
