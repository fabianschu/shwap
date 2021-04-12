import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("proposals")
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  proposerAddress: string;

  @Column({ default: null, nullable: true })
  proposerTokenAddress: string;

  @Column({ default: null, nullable: true })
  counterpartTokenAddress: string;

  @Column({ default: null, nullable: true })
  proposerTokenId: string;

  @Column({ default: null, nullable: true })
  counterpartTokenId: string;

  @ManyToOne(() => User, (user) => user.proposals)
  user: User;
}