import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity()
export class Subscribe extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.subscriber,
    { eager: true },
  )
  subscriber: User;

  @ManyToOne(
    type => User,
    user => user.subscribeTarget,
    { eager: true },
  )
  subscribeTarget: User;

  @Column({ type: 'boolean', default: true })
  subscribeTargetConfirm: boolean;

  @Column({ type: 'boolean', default: false })
  subscriberConfirm: boolean;

  @UpdateDateColumn()
  updateDate: string;

  @CreateDateColumn()
  createDate: string;
}
