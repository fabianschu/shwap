import { ethers } from "ethers";
import { Container } from "typedi";
import ProposalService from "../../src/services/proposalService";
import * as shwapInterface from "../../../artifacts/contracts/TradeHub.sol/TradeHub.json";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

const contracts = () => ({
  tradeHubContract: new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    shwapInterface.abi,
    provider
  ),
});

const { tradeHubContract } = contracts();

export const subscribeToEthereum = () => {
  if (process.env.NODE_ENV == "test") return;

  provider.on("block", (blocknumber) => {
    console.log("new block: ", blocknumber);
    // eventDispatcher.dispatch("onProposalAdded", "schubidubi");
  });

  proposalEvents();
};

const proposalEvents = () => {
  const proposalServiceInstance = Container.get(ProposalService);

  tradeHubContract.on(
    "ProposalAdded",
    (
      index,
      proposerAddress,
      proposerTokenAddress,
      counterpartTokenAddress,
      proposerTokenId,
      counterpartTokenId
    ) => {
      proposalServiceInstance.SaveProposal({
        index,
        proposerAddress,
        proposerTokenAddress,
        counterpartTokenAddress,
        proposerTokenId,
        counterpartTokenId,
      });
    }
  );

  tradeHubContract.on("IndexChange", (oldLastIdx, filledIndex) => {
    console.log({ oldLastIdx, filledIndex });
    // proposalServiceInstance.maintainOrder({
    //   filledIndex,
    //   newLastIndex,
    // });
  });
};
