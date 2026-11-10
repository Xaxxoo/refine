import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PartnerBrief } from "./partner-brief.entity";
import { User } from "../../users/entities/user.entity";

@Entity("structured_preferences")
export class StructuredPreference {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "brief_id" })
  briefId!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @Column({ length: 100 })
  attribute!: string;

  @Column({ name: "normalized_value", length: 200 })
  normalizedValue!: string;

  @Column({ name: "original_wording", type: "text" })
  originalWording!: string;

  @Column({ length: 50 })
  category!: string;

  @Column({ length: 20 })
  priority!: string;

  @Column({ type: "float", default: 0.5 })
  confidence!: number;

  @ManyToOne(() => PartnerBrief, (brief) => brief.preferences, { onDelete: "CASCADE" })
  @JoinColumn({ name: "brief_id" })
  brief!: PartnerBrief;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
