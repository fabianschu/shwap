import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import ConnectWallet from "./components/ConnectWallet";

const getLibrary = (provider) => new Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectWallet />
    </Web3ReactProvider>
  );
}

export default App;
