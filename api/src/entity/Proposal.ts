import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("proposals")
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  offerAddress: string;

  @Column({ default: null, nullable: true })
  wantedAddress: string;

  @ManyToOne(() => User, (user) => user.proposals)
  user: User;
}
