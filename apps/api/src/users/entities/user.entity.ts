import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ name: "display_name" })
  displayName!: string;

  @Column({ type: "text", nullable: true })
  bio!: string | null;

  @Column({ name: "date_of_birth", type: "date", nullable: true })
  dateOfBirth!: string | null;

  @Column({ nullable: true })
  gender!: string | null;

  @Column({ name: "avatar_url", nullable: true })
  avatarUrl!: string | null;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "is_verified", default: false })
  isVerified!: boolean;

  @Column({ type: "double precision", nullable: true })
  latitude!: number | null;

  @Column({ type: "double precision", nullable: true })
  longitude!: number | null;

  @Column({ type: "text", array: true, nullable: true })
  interests!: string[] | null;

  @Column({ type: "float", array: true, nullable: true, select: false })
  embedding!: number[] | null;

  @Column({ name: "last_seen_at", type: "timestamp", nullable: true })
  lastSeenAt!: Date | null;

  // --- PRD-required profile fields ---

  @Column({ name: "self_description", type: "text", nullable: true })
  selfDescription!: string | null;

  @Column({ length: 100, nullable: true })
  education!: string | null;

  @Column({ length: 50, nullable: true })
  religion!: string | null;

  @Column({ name: "relationship_intention", length: 50, nullable: true })
  relationshipIntention!: string | null;

  @Column({ name: "marital_history", length: 50, nullable: true })
  maritalHistory!: string | null;

  @Column({ length: 50, nullable: true })
  children!: string | null;

  @Column({ name: "height_cm", type: "int", nullable: true })
  heightCm!: number | null;

  @Column({ length: 20, nullable: true })
  smoking!: string | null;

  @Column({ length: 20, nullable: true })
  drinking!: string | null;

  @Column({ name: "relocation_intention", length: 50, nullable: true })
  relocationIntention!: string | null;

  @Column({ length: 100, nullable: true })
  occupation!: string | null;

  @Column({ name: "employment_status", length: 50, nullable: true })
  employmentStatus!: string | null;

  @Column({ name: "preferred_dating_genders", type: "text", array: true, nullable: true })
  preferredDatingGenders!: string[] | null;

  @Column({ name: "profile_embedding", type: "float", array: true, nullable: true, select: false })
  profileEmbedding!: number[] | null;

  // --- Role ---

  @Column({ length: 20, default: "user" })
  role!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
