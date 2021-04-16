import { EntitySchema } from "typeorm";
import { IUser } from "../../interfaces/IUser";

declare global {
  namespace Express {
    // export interface Request {
    //   currentUser: IUser & Document;
    // }
  }

  namespace Models {
    export type UserModel = EntitySchema<IUser>;
  }
}
