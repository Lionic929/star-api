import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole } from './enum/user-role.enum';
import { generateBcryptHash, generatePasswordSalt } from 'src/utils/hash';
import { Balance } from 'src/balance/balance.entity';
import { OnlineStatus } from 'src/online-status/online-status.entity';

@Entity()
@Unique(['login', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  login: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: keyof UserRole;

  @Column({ type: 'boolean', default: false })
  emailConfirm: boolean;

  @OneToOne(
    type => Balance,
    balance => balance.user,
    { eager: true },
  )
  balance: Balance;

  @OneToOne(
    type => OnlineStatus,
    onlineStatus => onlineStatus.user,
    { eager: true },
  )
  onlineStatus: OnlineStatus;

  @OneToMany(
    type => User,
    user => user.subscriber,
  )
  subscriber;

  @OneToMany(
    type => User,
    user => user.subscribeTarget,
  )
  subscribeTarget;

  static async hashPassword(password: string): Promise<string> {
    const salt = await generatePasswordSalt(password);
    return generateBcryptHash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const salt = await generatePasswordSalt(password);
    const hashPassword = generateBcryptHash(password, salt);
    return this.password === hashPassword;
  }

  isConfirm(): boolean {
    return this.emailConfirm;
  }
}
