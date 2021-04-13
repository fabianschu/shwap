import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
import { IProposal, IProposalDTO } from "../interfaces/IProposal";
import { Proposal } from "../entity/Proposal";

@Service()
export default class ProposalService {
  constructor(
    @Inject("proposalRepository")
    private proposalRepository: Repository<Proposal>,
    @Inject("logger") private logger
  ) {}

  public async SaveProposal(
    proposalDTO: IProposalDTO
  ): Promise<IProposal | any> {
    console.log("SaveProposal");
    const parsedProposal = this.parseFromBigNumbers(proposalDTO);
    try {
      return await this.proposalRepository.save(parsedProposal);
    } catch (e) {
      this.logger.error(`🔥 Error saving proposal`, e);
      throw e;
    }
  }

  private parseFromBigNumbers = (newProposal: IProposalDTO) => ({
    ...newProposal,
    index: newProposal.index.toNumber(),
    proposerTokenId: newProposal.proposerTokenId.toNumber(),
    counterpartTokenId: newProposal.counterpartTokenId.toNumber(),
  });
}
