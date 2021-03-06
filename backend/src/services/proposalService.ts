import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
import {
  IProposal,
  IProposalDTO,
  IIndexChangeDTO,
} from "../interfaces/IProposal";
import { Proposal } from "../entity/Proposal";
import { User } from "../entity/User";

@Service()
export default class ProposalService {
  constructor(
    @Inject("proposalRepository")
    private proposalRepository: Repository<Proposal>,
    @Inject("userRepository")
    private userRepository: Repository<User>,
    @Inject("logger") private logger
  ) {}

  public async SaveProposal(
    proposalDTO: IProposalDTO
  ): Promise<IProposal | any> {
    const parsedProposal = this.parseFromBigNumbers(proposalDTO);
    try {
      const user = await this.userRepository.findOne({
        pubAddr: parsedProposal.proposerAddress,
      });
      const proposal = await this.proposalRepository.save({
        ...parsedProposal,
        status: "open",
        user: user,
      });
      return proposal;
    } catch (e) {
      this.logger.error(`🔥 Error saving proposal`, e);
      throw e;
    }
  }

  // remove accepted proposal from db
  // and last proposal and update its index to fill gap
  public async MaintainOrder(
    SaveIndexDTO: IIndexChangeDTO
  ): Promise<IProposal | any> {
    try {
      const removeIndex = SaveIndexDTO.filledIndex.toNumber();
      const newLastIndex = SaveIndexDTO.newLastIndex.toNumber();

      await this.proposalRepository.update(
        { index: removeIndex },
        { index: null, status: "filled" }
      );
      await this.proposalRepository.update(
        { index: newLastIndex + 1 },
        { index: removeIndex }
      );
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
