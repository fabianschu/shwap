import { ethers } from "ethers";

export const addEventlisteners = (
  provider: ethers.providers.JsonRpcProvider
) => {
  provider.on("block", (blocknumber) => {
    console.log("new block");
    console.log(blocknumber);
  });
};

const proposalEvents = () => {};
