import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("user_preferences")
export class UserPreferences {
  @PrimaryColumn({ name: "user_id", type: "uuid" })
  userId!: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "min_age", type: "int", nullable: true, default: 18 })
  minAge!: number | null;

  @Column({ name: "max_age", type: "int", nullable: true, default: 99 })
  maxAge!: number | null;

  @Column({ name: "preferred_gender", type: "varchar", nullable: true })
  preferredGender!: string | null;

  @Column({ name: "max_distance_km", type: "int", nullable: true, default: 50 })
  maxDistanceKm!: number | null;
}
