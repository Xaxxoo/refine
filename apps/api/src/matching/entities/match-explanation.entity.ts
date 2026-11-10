import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("match_explanations")
export class MatchExplanation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @Column({ name: "candidate_id" })
  candidateId!: string;

  @Column({ name: "overall_score", type: "float", default: 0 })
  overallScore!: number;

  @Column({ name: "score_breakdown", type: "jsonb", default: {} })
  scoreBreakdown!: Record<string, number>;

  @Column({ type: "text", array: true, default: () => "'{}'::text[]" })
  strengths!: string[];

  @Column({ type: "text", array: true, default: () => "'{}'::text[]" })
  differences!: string[];

  @Column({ name: "generated_at", type: "timestamp", default: () => "now()" })
  generatedAt!: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "candidate_id" })
  candidate!: User;
}
