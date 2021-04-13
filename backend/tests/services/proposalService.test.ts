import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import { BigNumber } from "@ethersproject/bignumber";
import ProposalService from "../../src/services/ProposalService";
import { Proposal } from "../../src/entity/Proposal";
import ProposalServiceDTO from "../fixtures/events";

describe("AuthService", () => {
  let proposalServiceInstance: ProposalService;
  let connection: Connection;
  let proposalRepository: Repository<Proposal>;

  const mockLoggerInstance = {
    error() {},
    silly() {},
  };

  beforeAll(async () => {
    connection = await createConnection();
    proposalRepository = getRepository(Proposal);
    proposalServiceInstance = new ProposalService(
      proposalRepository,
      mockLoggerInstance
    );
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("#SaveProposal", () => {
    afterEach(async () => {
      const proposal = await proposalRepository.findOne();
      await proposalRepository.delete(proposal.id);
    });

    it.only("creates a new proposal in the database", async () => {
      const { id } = await proposalServiceInstance.SaveProposal(
        ProposalServiceDTO
      );
      const newProposal = await proposalRepository.findOne(id);
      expect(newProposal.index).toBe(ProposalServiceDTO.index.toNumber());
    });

    // it("returns an error if user already exists", async () => {
    //   const userInputDTO = {
    //     pubAddr: "123456789",
    //   };
    //   await authServiceInstance.SignUp(userInputDTO);
    //   const { message } = await authServiceInstance.SignUp(userInputDTO);
    //   expect(message).toMatch("Address already exists");
    // });
  });
});
