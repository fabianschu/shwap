import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import typeormLoader from "./typeorm";
import { User } from "../entity/User";
import { Proposal } from "../entity/Proposal";
import { setupInterface } from "./ethers";

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
  const ethereumInterface = setupInterface();

  dependencyInjectorLoader({ models });

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
