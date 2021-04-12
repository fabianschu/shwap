import { ethers } from "ethers";
import { addEventlisteners } from "../subscribers/etherSubscribers";

export const setupInterface = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  if (process.env.NODE_ENV !== "test") addEventlisteners(provider);

  return provider;
};
