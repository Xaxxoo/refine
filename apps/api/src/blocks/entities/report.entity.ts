import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "reporter_id" })
  reporterId!: string;

  @Column({ name: "reported_id" })
  reportedId!: string;

  @Column({ length: 100 })
  reason!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ default: "pending" })
  status!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reporter_id" })
  reporter!: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reported_id" })
  reported!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
