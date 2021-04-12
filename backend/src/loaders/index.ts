import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import typeormLoader from "./typeorm";
import { User } from "../entity/User";
import { Proposal } from "../entity/Proposal";
import { subscribeToEthereum } from "../subscribers/etherSubscribers";
import "../subscribers/proposalSubscribers";

const models = [
  {
    name: "userRepository",
    model: User,
  },
  {
    name: "proposalRepository",
    model: Proposal,
  },
];

export default async ({ expressApp }) => {
  await typeormLoader();
  Logger.info("✌️ DB loaded and connected!");

  dependencyInjectorLoader({ models });

  subscribeToEthereum();
  Logger.info("✌️ Susbcribed to Ethereum");

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
