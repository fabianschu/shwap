import { getRepository, getConnection } from "typeorm";
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

export async function createUser(): Promise<string> {
  getConnection("default");
  const userRepository = getRepository(User);
  const mockLoggerInstance = {
    error() {},
    silly() {},
  };
  const authServiceInstance = new AuthService(
    userRepository,
    mockLoggerInstance
  );
  const { pubAddr, nonce } = await authServiceInstance.SignUp({
    pubAddr: publicAddress,
  });
  const userInputDTO = {
    pubAddr,
    signedNonce: signMsg(nonce, privateKey),
  };
  const token = await authServiceInstance.SignIn(userInputDTO);
  return token;
}

export async function deleteUser() {
  getConnection("default");
  const userRepository = getRepository(User);
  const userRecord = await userRepository.findOne();
  userRecord && (await userRepository.delete(userRecord.id));
}
