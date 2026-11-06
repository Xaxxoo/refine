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

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
