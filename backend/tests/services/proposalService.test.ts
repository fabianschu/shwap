import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import { BigNumber } from "@ethersproject/bignumber";
import ProposalService from "../../src/services/ProposalService";
import { Proposal } from "../../src/entity/Proposal";
import { User } from "../../src/entity/User";
import ProposalServiceDTO from "../_fixtures/proposalAddedEvent";

describe("ProposalService", () => {
  let proposalServiceInstance: ProposalService;
  let connection: Connection;
  let proposalRepository: Repository<Proposal>;
  let userRepository: Repository<User>;

  const mockLoggerInstance = {
    error() {},
    silly() {},
  };

  beforeAll(async () => {
    connection = await createConnection();
    proposalRepository = getRepository(Proposal);
    userRepository = getRepository(User);
    proposalServiceInstance = new ProposalService(
      proposalRepository,
      userRepository,
      mockLoggerInstance
    );
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    await proposalRepository.query("DELETE FROM proposals;");
    await userRepository.query("DELETE FROM users;");
  });

  describe("#SaveProposal", () => {
    let id: number;

    const userAddress = ProposalServiceDTO.proposerAddress;

    beforeEach(async () => {
      await userRepository.save({ pubAddr: userAddress, nonce: "abc" });
      const proposal = await proposalServiceInstance.SaveProposal(
        ProposalServiceDTO
      );
      id = proposal.id;
    });

    it("creates a new proposal in the database", async () => {
      const newProposal = await proposalRepository.findOne(id);
      expect(newProposal.index).toBe(ProposalServiceDTO.index.toNumber());
    });

    it("sets the proposal status to 'open' ", async () => {
      const newProposal = await proposalRepository.findOne(id);
      expect(newProposal.status).toEqual("open");
    });

    it("lets the proposal reference a user", async () => {
      const newProposal = await proposalRepository.findOne(id, {
        relations: ["user"],
      });
      expect(newProposal.user.pubAddr).toEqual(userAddress);
    });
  });

  describe("#MaintainOrder", () => {
    afterEach(async () => {
      await proposalRepository.query("DELETE FROM proposals;");
    });

    describe("with only one proposal", () => {
      beforeEach(async () => {
        await proposalServiceInstance.SaveProposal({
          ...ProposalServiceDTO,
          proposerTokenId: BigNumber.from(0),
          counterpartTokenId: BigNumber.from(0),
        });
        await proposalServiceInstance.MaintainOrder({
          filledIndex: BigNumber.from(0),
          newLastIndex: BigNumber.from(0),
        });
      });

      it("changes the accepted proposal's status to 'filled' ", async () => {
        const { status } = await proposalRepository.findOne({
          proposerTokenId: 0,
        });
        expect(status).toEqual("filled");
      });

      it("sets the index of accepted proposal to null ", async () => {
        const { index } = await proposalRepository.findOne({
          proposerTokenId: 0,
        });
        expect(index).toBeNull();
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

      describe("when first proposal was accepted", () => {
        const filledIndex = 0;
        const newLastIndex = 1;

        beforeEach(async () => {
          await proposalServiceInstance.MaintainOrder({
            filledIndex: BigNumber.from(filledIndex),
            newLastIndex: BigNumber.from(newLastIndex),
          });
        });

        it("sets status of first proposal to 'filled'", async () => {
          const { status } = await proposalRepository.findOne({
            proposerTokenId: 0,
          });
          expect(status).toEqual("filled");
        });

        it("sets index of first proposal to null", async () => {
          const { index } = await proposalRepository.findOne({
            proposerTokenId: 0,
          });
          expect(index).toEqual(null);
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

        it("sets status of accepted proposal to 'filled' ", async () => {
          const { status } = await proposalRepository.findOne({
            proposerTokenId: 1,
          });

          expect(status).toEqual("filled");
        });

        it("sets index of accepted proposal to null ", async () => {
          const { index } = await proposalRepository.findOne({
            proposerTokenId: 1,
          });

          expect(index).toBeNull();
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

        it("sets status of accepted proposal to 'filled' ", async () => {
          const { status } = await proposalRepository.findOne({
            proposerTokenId: 2,
          });

          expect(status).toEqual("filled");
        });

        it("sets index of accepted proposal to null ", async () => {
          const { index } = await proposalRepository.findOne({
            proposerTokenId: 2,
          });

          expect(index).toBeNull();
        });
      });
    });
  });
});
