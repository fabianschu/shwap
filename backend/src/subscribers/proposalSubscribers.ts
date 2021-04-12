import { Container, Inject } from "typedi";
import { EventSubscriber, On } from "event-dispatch";
import { Repository } from "typeorm";
import events from "./events";
import { Logger } from "winston";
import { Proposal } from "../entity/Proposal";
import { IProposal } from "../interfaces/IProposal";

@EventSubscriber()
export default class ProposalSubscriber {
  @On(events.proposal.onProposalAdded)
  public async onProposalAdded(newProposal: IProposal) {
    const Logger: Logger = Container.get("logger");
    const proposalRepository: Repository<Proposal> = Container.get(
      "proposalRepository"
    );

    try {
      const proposal = await proposalRepository.save(newProposal);
    } catch (e) {
      Logger.error(
        `🔥 Error on event ${events.proposal.onProposalAdded}: %o`,
        e
      );
      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }
}
