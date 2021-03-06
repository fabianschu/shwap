import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("proposals")
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  index: number;

  @Column({ default: null, nullable: true })
  proposerAddress: string;

  @Column({ default: null, nullable: true })
  proposerTokenAddress: string;

  @Column({ default: null, nullable: true })
  counterpartTokenAddress: string;

  @Column({ default: null, nullable: true })
  proposerTokenId: number;

  @Column({ default: null, nullable: true })
  counterpartTokenId: number;

  @Column({ default: null, nullable: true })
  status: string;

  @ManyToOne(() => User, (user) => user.proposals)
  user: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
