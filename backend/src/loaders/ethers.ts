import { ethers } from "ethers";
import { addEventlisteners } from "../subscribers/ethereumEvents";

export const setupInterface = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  addEventlisteners(provider);

  return provider;
};
