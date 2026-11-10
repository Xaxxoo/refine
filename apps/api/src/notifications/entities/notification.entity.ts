import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @Column({ length: 50 })
  type!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "jsonb", default: {} })
  data!: Record<string, any>;

  @Column({ name: "is_read", default: false })
  isRead!: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
