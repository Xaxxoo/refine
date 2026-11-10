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

  @Column({ name: "reviewed_by", type: "uuid", nullable: true })
  reviewedBy!: string | null;

  @Column({ name: "reviewed_at", type: "timestamp", nullable: true })
  reviewedAt!: Date | null;

  @Column({ name: "action_taken", length: 50, nullable: true })
  actionTaken!: string | null;

  @Column({ name: "admin_notes", type: "text", nullable: true })
  adminNotes!: string | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reporter_id" })
  reporter!: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reported_id" })
  reported!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "reviewed_by" })
  reviewer!: User | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
