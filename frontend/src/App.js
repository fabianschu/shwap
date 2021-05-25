import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import ConnectWallet from "./components/ConnectWallet";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectWallet />
    </Web3ReactProvider>
  );
}

export default App;
