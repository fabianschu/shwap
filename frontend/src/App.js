import logo from "./logo.svg";
import "./App.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

function getLibrary(provider, connector) {
  return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
}

function App() {
  console.log(getLibrary());
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div>lol</div>
    </Web3ReactProvider>
  );
}

export default App;
