import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injectedConnector = new InjectedConnector({
  supportedChainIds: [1337],
});

const ConnectWallet = () => {
  const { activate, active } = useWeb3React();

  const handleClick = () => {
    activate(injectedConnector);
  };

  return !active ? (
    <button onClick={handleClick}>Connect</button>
  ) : (
    <p>Connected</p>
  );
};

export default ConnectWallet;
