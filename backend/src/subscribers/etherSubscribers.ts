import { ethers } from "ethers";
import { EventDispatcher } from "event-dispatch";
import * as shwapInterface from "../../../artifacts/contracts/Shwap.sol/Shwap.json";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const eventDispatcher = new EventDispatcher();

export const subscribeToEthereum = () => {
  provider.on("block", (blocknumber) => {
    console.log("new block: ", blocknumber);
    // eventDispatcher.dispatch("onProposalAdded", "schubidubi");
  });

  proposalEvents();
};

const proposalEvents = () => {
  const shwapContract = new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    shwapInterface.abi,
    provider
  );

  shwapContract.on(
    "ProposalAdded",
    (
      index,
      proposerAddress,
      proposerTokenAddress,
      counterpartTokenAddress,
      proposerTokenId,
      counterpartTokenId
    ) => {
      console.log("New EVENT!!");
      console.log({
        index,
        proposerAddress,
        proposerTokenAddress,
        counterpartTokenAddress,
        proposerTokenId,
        counterpartTokenId,
      });
      eventDispatcher.dispatch("onProposalAdded", {
        index,
        proposerAddress,
        proposerTokenAddress,
        counterpartTokenAddress,
        proposerTokenId,
        counterpartTokenId,
      });
    }
  );
};
