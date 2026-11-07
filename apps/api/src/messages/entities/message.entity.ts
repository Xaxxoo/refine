import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "sender_id" })
  senderId!: string;

  @Column({ name: "receiver_id" })
  receiverId!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ name: "is_read", default: false })
  isRead!: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sender_id" })
  sender!: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiver_id" })
  receiver!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
