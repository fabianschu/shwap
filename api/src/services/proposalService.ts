import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
// import { IUserInputDTO, IUser } from "../interfaces/IUser";
import { Proposal } from "../entity/Proposal";
// import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
// import events from '../subscribers/events';

@Service()
export default class AuthService {
  constructor(
    @Inject("proposalRepository")
    private proposalRepository: Repository<Proposal>,
    @Inject("logger") private logger
  ) {}
  // public async SignUp(userInputDTO: IUserInputDTO): Promise<IUser | any> {
  //   try {
  //     const { pubAddr } = userInputDTO;
  //     const userRecord = await this.userRepository.findOne({ pubAddr });
  //     if (userRecord) throw new Error("User cannot be created");
  //     const nonce: any = this.generateNonce();
  //     return await this.userRepository.save({
  //       pubAddr,
  //       nonce,
  //     });
  //   } catch (e) {
  //     this.logger.error(e);
  //     return e;
  //   }
  // }

  // private generateToken(user: IUser) {
  //   const today = new Date();
  //   const exp = new Date(today);
  //   exp.setDate(today.getDate() + 60);
  //   this.logger.silly(`Sign JWT for userId: ${user.pubAddr}`);
  //   return jwt.sign(
  //     {
  //       pubAddr: user.pubAddr,
  //       exp: exp.getTime() / 1000,
  //     },
  //     config.jwtSecret
  //   );
  // }
}
