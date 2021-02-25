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
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    type => User,
    user => user.balance,
  )
  @JoinColumn()
  user: User;

  @Column({ type: 'float', default: 0 })
  amount: number;

  @UpdateDateColumn()
  updateDate: string;
}
