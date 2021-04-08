import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Proposal } from "./Proposal";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pubAddr: string;

  @Column()
  nonce: string;

  @OneToMany(() => Proposal, (proposal) => proposal.user)
  proposals: Proposal[];
}
