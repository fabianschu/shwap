import { ECDSASignature } from "ethereumjs-util";

export interface IUser {
  id: number;
  pubAddr: string;
  nonce: string;
}

export interface IUserInputDTO {
  pubAddr: string;
  signedNonce?: ECDSASignature;
}
