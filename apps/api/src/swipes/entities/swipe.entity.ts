import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("swipes")
@Unique(["swiperId", "swipedId"])
export class Swipe {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "swiper_id" })
  swiperId!: string;

  @Column({ name: "swiped_id" })
  swipedId!: string;

  @Column()
  action!: string;

  @Column({ name: "is_match", default: false })
  isMatch!: boolean;

  @Column({ type: "text", nullable: true })
  message!: string | null;

  @Column({ length: 20, default: "discovery" })
  source!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "swiper_id" })
  swiper!: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "swiped_id" })
  swiped!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
