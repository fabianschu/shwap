export interface IProposal {
  id: number;
  offerAddress: string;
  wantedAddress: string;
}

export interface IProposalDTO {
  offerAddress?: string;
  wantedAddress?: string;
  user: number;
}
