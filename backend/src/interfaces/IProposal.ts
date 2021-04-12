export interface IProposal {
  id: number;
  proposerAddress: string;
  proposerTokenAddress: string;
  counterpartTokenAddress: string;
  proposerTokenId: string;
  counterpartTokenId: string;
}

export interface IProposalDTO {
  offerAddress?: string;
  wantedAddress?: string;
  user: number;
}
