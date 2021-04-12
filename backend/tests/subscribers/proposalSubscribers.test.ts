import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import { Container } from "typedi";
import { privateToAddress, ecsign, hashPersonalMessage } from "ethereumjs-util";
import { Proposal } from "../../src/entity/Proposal";
import "../../src/subscribers/proposalSubscribers";
import { EventDispatcher } from "event-dispatch";
import LoggerInstance from "../../src/loaders/logger";

const hexString =
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const privateKey = Buffer.from(hexString, "hex");
const publicAddress = privateToAddress(privateKey).toString("hex");

const signMsg = (msg: string, privKey: Buffer) => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  return ecsign(msgHash, privKey);
};

describe("proposalSubscribers", () => {
  let connection: Connection;
  let proposalRepository;

  beforeAll(async () => {
    connection = await createConnection();
    Container.set("logger", LoggerInstance);
    proposalRepository = getRepository(Proposal);
    Container.set("proposalRepository", proposalRepository);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("#onProposalAdded", () => {
    afterEach(async () => {
      // const proposal = await proposalRepository.findOne();
      // proposal && (await proposalRepository.delete(proposal.id));
    });

    it("creates a new user", async () => {
      const eventDispatcher = new EventDispatcher();
      eventDispatcher.dispatch("onProposalAdded", "flup");
      // const userInputDTO = {
      //   pubAddr: publicAddress,
      // };
      // const { id } = await authServiceInstance.SignUp(userInputDTO);
      // const newUser = await userRepository.findOne(id);
      // expect(newUser.pubAddr).toBe(publicAddress);
    });
  });
});
