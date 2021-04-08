import request from "supertest";
import express from "express";
import { getConnection, getRepository, Repository } from "typeorm";
import loader from "../../src/loaders";
import { Proposal } from "../../src/entity/Proposal";
import { createUser, deleteUser } from "../fixtures/user";

const app = express();

describe("/proposals route", () => {
  let proposalRepository: Repository<Proposal>;
  let authHeader: object;

  const mockLoggerInstance = {
    error() {},
    silly() {},
  };

  beforeAll(async () => {
    await loader({ expressApp: app });
    const bearerToken = await createUser();
    authHeader = { Authorization: "Bearer " + bearerToken };
    proposalRepository = getRepository(Proposal);
  });

  afterAll(async () => {
    await deleteUser();
    const dbConnection = getConnection("default");
    await dbConnection.close();
  });

  describe("POST /proposals", () => {
    describe("unauthenticated (wrong bearer token)", () => {
      it("should return 401", (done) => {
        request(app)
          .post(`/api/proposals`)
          .set({ Authorization: "lol" })
          .send()
          .expect(401)
          .end(done);
      });
    });

    describe("authenticated", () => {
      describe("without parameter", () => {
        it("should return 400", (done) => {
          request(app)
            .post(`/api/proposals`)
            .set(authHeader)
            .send()
            .expect(400)
            .end(done);
        });
      });

      describe("with valid parameters", () => {
        beforeAll(() => {});

        afterEach(async () => {
          const proposal = await proposalRepository.findOne();
          proposal && (await proposalRepository.delete(proposal.id));
        });

        describe("without parameter", () => {
          it("should return 400", (done) => {
            request(app)
              .post(`/api/proposals`)
              .set(authHeader)
              .send()
              .expect(400)
              .end(done);
          });
        });

        describe("with valid parameters", () => {
          it("creates a proposal", async (done) => {
            const proposal = {
              offerAddress: "abc123",
            };
            await request(app)
              .post(`/api/proposals`)
              .set(authHeader)
              .send(proposal);
            const savedProposal = await proposalRepository.findOne(proposal);
            expect(savedProposal.offerAddress).toBe(proposal.offerAddress);
            done();
          });
        });
      });
    });
  });
});
