import { Container } from "typedi";
import { getRepository } from "typeorm";
import LoggerInstance from "./logger";

export default ({ models }: { models: { name: string; model: any }[] }) => {
  try {
    models.forEach((m) => {
      Container.set(m.name, getRepository(m.model));
    });
    Container.set("logger", LoggerInstance);
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
