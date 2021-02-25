import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity()
export class OnlineStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    type => User,
    user => user.onlineStatus,
  )
  @JoinColumn()
  user: User;

  @Column({ type: 'boolean', default: null })
  status: boolean;

  @UpdateDateColumn()
  updateDate: string;
}
