import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { StructuredPreference } from "./structured-preference.entity";

@Entity("partner_briefs")
export class PartnerBrief {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @Column({ name: "raw_text", type: "text" })
  rawText!: string;

  @Column({ length: 100, nullable: true })
  title!: string | null;

  @Column({ name: "is_active", default: false })
  isActive!: boolean;

  @Column({ name: "processing_status", length: 20, default: "pending" })
  processingStatus!: string;

  @Column({ name: "brief_embedding", type: "float", array: true, nullable: true, select: false })
  briefEmbedding!: number[] | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => StructuredPreference, (pref) => pref.brief, { cascade: true })
  preferences!: StructuredPreference[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
