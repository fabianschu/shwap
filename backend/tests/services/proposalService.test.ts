import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import { BigNumber } from "@ethersproject/bignumber";
import ProposalService from "../../src/services/ProposalService";
import { Proposal } from "../../src/entity/Proposal";
import ProposalServiceDTO from "../_fixtures/proposalAddedEvent";
import IndexChangeDTO from "../_fixtures/indexChangeEvent";

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
      await proposalRepository.query("DELETE FROM proposals;");
    });

    it("creates a new proposal in the database", async () => {
      const { id } = await proposalServiceInstance.SaveProposal(
        ProposalServiceDTO
      );
      const newProposal = await proposalRepository.findOne(id);
      expect(newProposal.index).toBe(ProposalServiceDTO.index.toNumber());
    });
    describe("with only one proposal", () => {
      it("removes accepted proposal from db", async () => {
        await proposalServiceInstance.SaveProposal(ProposalServiceDTO);

        const proposalAmountPre = await proposalRepository.count();

        await proposalServiceInstance.MaintainOrder(IndexChangeDTO);
        const proposalAmountPost = await proposalRepository.count();

        // const { message } = await authServiceInstance.SignUp(userInputDTO);
        expect(proposalAmountPost).toEqual(0);
      });
    });

    describe("with three proposals", () => {
      beforeEach(async () => {
        await proposalServiceInstance.SaveProposal({
          ...ProposalServiceDTO,
          index: BigNumber.from(0),
          proposerTokenId: BigNumber.from(0),
          counterpartTokenId: BigNumber.from(0),
        });
        await proposalServiceInstance.SaveProposal({
          ...ProposalServiceDTO,
          index: BigNumber.from(1),
          proposerTokenId: BigNumber.from(1),
          counterpartTokenId: BigNumber.from(1),
        });
        await proposalServiceInstance.SaveProposal({
          ...ProposalServiceDTO,
          index: BigNumber.from(2),
          proposerTokenId: BigNumber.from(2),
          counterpartTokenId: BigNumber.from(2),
        });
      });

      describe("when removing the first proposal", () => {
        const filledIndex = 0;
        const newLastIndex = 1;

        beforeEach(async () => {
          await proposalServiceInstance.MaintainOrder({
            filledIndex: BigNumber.from(filledIndex),
            newLastIndex: BigNumber.from(newLastIndex),
          });
        });

        afterEach(async () => {
          await proposalRepository.query("DELETE FROM proposals;");
        });

        it("removes first proposal from db", async () => {
          expect(
            await proposalRepository.findOne({ proposerTokenId: 0 })
          ).toBeUndefined();
        });

        it("changes the index of the previously last-indexed proposal to zero", async () => {
          const shiftedProposal = await proposalRepository.findOne({
            proposerTokenId: 2,
          });

          expect(shiftedProposal.index).toEqual(0);
        });
      });

      describe("when removing the second proposal", () => {
        const filledIndex = 1;
        const newLastIndex = 1;

        beforeEach(async () => {
          await proposalServiceInstance.MaintainOrder({
            filledIndex: BigNumber.from(filledIndex),
            newLastIndex: BigNumber.from(newLastIndex),
          });
        });

        afterEach(async () => {
          await proposalRepository.query("DELETE FROM proposals;");
        });

        it("removes second proposal (index = 1) from db", async () => {
          expect(
            await proposalRepository.findOne({ proposerTokenId: 1 })
          ).toBeUndefined();
        });

        it("changes the index of the previously last-indexed proposal to one", async () => {
          const shiftedProposal = await proposalRepository.findOne({
            proposerTokenId: 2,
          });

          expect(shiftedProposal.index).toEqual(1);
        });
      });

      describe("when removing the third proposal", () => {
        const filledIndex = 2;
        const newLastIndex = 1;

        beforeEach(async () => {
          await proposalServiceInstance.MaintainOrder({
            filledIndex: BigNumber.from(filledIndex),
            newLastIndex: BigNumber.from(newLastIndex),
          });
        });

        afterEach(async () => {
          await proposalRepository.query("DELETE FROM proposals;");
        });

        it("removes third proposal (index = 2) from db", async () => {
          expect(
            await proposalRepository.findOne({ proposerTokenId: 2 })
          ).toBeUndefined();
        });

        it("changes no indices", async () => {
          const firstProposal = await proposalRepository.findOne({
            proposerTokenId: 0,
          });
          const secondProposal = await proposalRepository.findOne({
            proposerTokenId: 1,
          });
          console.log(
            await proposalRepository.query("SELECT * FROM proposals;")
          );
          expect(firstProposal.index).toEqual(0);
          expect(secondProposal.index).toEqual(1);
        });
      });
    });
  });
});
