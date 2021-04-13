import { BigNumber } from "@ethersproject/bignumber";

export interface IProposal {
  contractIndex: number;
  proposerAddress: string;
  proposerTokenAddress: string;
  counterpartTokenAddress: string;
  proposerTokenId: string;
  counterpartTokenId: string;
}

export interface IProposalDTO {
  index: BigNumber;
  proposerAddress: string;
  proposerTokenAddress: string;
  counterpartTokenAddress: string;
  proposerTokenId: BigNumber;
  counterpartTokenId: BigNumber;
}
