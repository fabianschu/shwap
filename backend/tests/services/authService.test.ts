import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import { privateToAddress, ecsign, hashPersonalMessage } from "ethereumjs-util";
import AuthService from "../../src/services/authService";
import { User } from "../../src/entity/User";

const hexString =
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const privateKey = Buffer.from(hexString, "hex");
const publicAddress = privateToAddress(privateKey).toString("hex");

const signMsg = (msg: string, privKey: Buffer) => {
  const msgHash = hashPersonalMessage(Buffer.from(msg));
  return ecsign(msgHash, privKey);
};

describe("AuthService", () => {
  let authServiceInstance: AuthService;
  let connection: Connection;
  let userRepository: Repository<User>;

  const mockLoggerInstance = {
    error() {},
    silly() {},
  };

  beforeAll(async () => {
    connection = await createConnection();
    userRepository = getRepository(User);
    authServiceInstance = new AuthService(userRepository, mockLoggerInstance);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("#SignUp", () => {
    afterEach(async () => {
      const user = await userRepository.findOne();
      await userRepository.delete(user.id);
    });

    it("creates a new user", async () => {
      const userInputDTO = {
        pubAddr: publicAddress,
      };
      const { id } = await authServiceInstance.SignUp(userInputDTO);
      const newUser = await userRepository.findOne(id);
      expect(newUser.pubAddr).toBe(publicAddress);
    });

    it("returns an error if user already exists", async () => {
      const userInputDTO = {
        pubAddr: "123456789",
      };
      await authServiceInstance.SignUp(userInputDTO);
      const { message } = await authServiceInstance.SignUp(userInputDTO);
      expect(message).toMatch("Address already exists");
    });
  });

  describe("#SignIn", () => {
    afterEach(async () => {
      const user = await userRepository.findOne();
      user && (await userRepository.delete(user.id));
    });

    it("returns an error if the public address does not exist", async () => {
      const userInputDTO = {
        pubAddr: publicAddress,
      };
      const { message } = await authServiceInstance.SignIn(userInputDTO);
      expect(message).toMatch("Invalid");
    });

    it("returns an error if no signature is provided", async () => {
      await userRepository.save({ pubAddr: publicAddress, nonce: "bubu" });
      const userInputDTO = {
        pubAddr: publicAddress,
        signedNonce: null,
      };
      const { message } = await authServiceInstance.SignIn(userInputDTO);
      expect(message).toMatch("Invalid");
    });

    it("returns an error if wrong signature is provided", async () => {
      await userRepository.save({ pubAddr: publicAddress, nonce: "bubu" });
      const userInputDTO = {
        pubAddr: publicAddress,
        signedNonce: {
          r: Buffer.from("hello world", "utf8"),
          s: Buffer.from("hello world", "utf8"),
          v: 10,
        },
      };
      const { message } = await authServiceInstance.SignIn(userInputDTO);
      expect(message).toMatch("Invalid");
    });

    it("returns a JWT if signature is correct", async () => {
      const nonce = "123456";
      await userRepository.save({ pubAddr: publicAddress, nonce: nonce });
      const userInputDTO = {
        pubAddr: publicAddress,
        signedNonce: signMsg(nonce, privateKey),
      };
      const token = await authServiceInstance.SignIn(userInputDTO);
      expect(token).not.toBeNull();
    });

    it("generates a new nonce if signature is correct", async () => {
      const nonce = "123456";
      await userRepository.save({ pubAddr: publicAddress, nonce: nonce });
      const userInputDTO = {
        pubAddr: publicAddress,
        signedNonce: signMsg(nonce, privateKey),
      };
      await authServiceInstance.SignIn(userInputDTO);
      const userRecord = await userRepository.findOne();
      expect(userRecord.nonce).not.toEqual(nonce);
    });
  });
});
