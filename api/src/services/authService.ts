import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
import jwt, { sign } from "jsonwebtoken";
import {
  hashPersonalMessage,
  ECDSASignature,
  ecrecover,
  publicToAddress,
  bufferToHex,
} from "ethereumjs-util";
import randomstring from "randomstring";
import config from "../config";
import { IUserInputDTO, IUser } from "../interfaces/IUser";
import { User } from "../entity/User";
// import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
// import events from '../subscribers/events';

@Service()
export default class AuthService {
  constructor(
    @Inject("userRepository") private userRepository: Repository<User>,
    @Inject("logger") private logger
  ) {}
  public async SignUp(userInputDTO: IUserInputDTO): Promise<IUser | any> {
    try {
      const { pubAddr } = userInputDTO;
      const userRecord = await this.userRepository.findOne({ pubAddr });

      if (userRecord) throw new Error("Address already exists");
      const nonce: any = this.generateNonce();
      return await this.userRepository.save({
        pubAddr,
        nonce,
      });
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }

  public async SignIn(userInputDTO: IUserInputDTO): Promise<any> {
    try {
      const { pubAddr, signedNonce: signature } = userInputDTO;
      const userRecord = await this.userRepository.findOne({ pubAddr });
      if (!userRecord) throw new Error("Invalid");

      const validSignature = this.verifyNonce(
        signature,
        userRecord.nonce,
        userRecord.pubAddr
      );
      if (!validSignature) throw new Error("Invalid");

      const token = this.generateToken(userRecord);
      const newNonce = this.generateNonce();
      await this.userRepository.update(userRecord.id, { nonce: newNonce });
      return token;
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }

  private generateToken(user: IUser) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    this.logger.silly(`Sign JWT for userId: ${user.pubAddr}`);
    return jwt.sign(
      {
        pubAddr: user.pubAddr,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  private generateNonce(): string {
    return randomstring.generate();
  }

  private verifyNonce(
    signature: ECDSASignature,
    msg: string,
    pubAddr: string
  ): boolean {
    if (!signature) return false;
    const { v, r, s } = signature;
    if (!v || !r || !s) return false;

    const msgHash = hashPersonalMessage(Buffer.from(msg));
    const publicKey = ecrecover(msgHash, signature.v, signature.r, signature.s);
    const addressBuffer = publicToAddress(publicKey);
    const address = bufferToHex(addressBuffer);
    return "0x" + pubAddr === address;
  }
}
