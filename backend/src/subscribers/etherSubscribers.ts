import { ethers } from "ethers";
import * as shwapInterface from "../../../artifacts/contracts/Shwap.sol/Shwap.json";

export const addEventlisteners = (
  provider: ethers.providers.JsonRpcProvider
) => {
  provider.on("block", (blocknumber) => {
    console.log(blocknumber);
  });

  proposalEvents(provider);
};

const proposalEvents = (provider) => {
  const shwapContract = new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    shwapInterface.abi,
    provider
  );

  shwapContract.on("ProposalAdded", (val) => {
    console.log("New EVENT!!");
    console.log(val);
  });
};
