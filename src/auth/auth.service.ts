import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { LoginInfo } from './interface/login-info.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BalanceService } from 'src/balance/balance.service';
import { OnlineStatusService } from 'src/online-status/online-status.service';
import { Errors } from './enum/errors.enum';
import { AccountInfoDto } from './dto/account-info.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private balanceService: BalanceService,
    private onlineStatusService: OnlineStatusService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<LoginInfo> {
    const user: User = await this.userRepository.signUp(userSignUpDto);

    user.balance = await this.balanceService.createUserBalance(user);
    user.onlineStatus = await this.onlineStatusService.createUserOnlineStatus(
      user,
    );

    const accessToken = await this.createJwt(user);

    const loginInfo: LoginInfo = { accessToken };
    return loginInfo;
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginInfo> {
    const userData = await this.userRepository.login(userLoginDto);

    const accessToken = await this.createJwt(userData);

    const loginInfo: LoginInfo = { accessToken };
    return loginInfo;
  }

  async createJwt(user: User): Promise<string> {
    const {
      login,
      id,
      role,
      email,
      emailConfirm,
      balance: { amount: balanceAmount },
    } = user;

    const payload: JwtPayload = {
      login,
      id,
      role,
      email,
      emailConfirm,
      balanceAmount,
    };

    return this.jwtService.sign(payload);
  }

  async updateLogin(user: User): Promise<LoginInfo> {
    const accessToken = await this.createJwt(user);

    const loginInfo: LoginInfo = { accessToken };
    return loginInfo;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(Errors.USER_WITH_THIS_ID_NOT_FOUND);
    }

    return user;
  }

  async getAccountInfo(user: User): Promise<AccountInfoDto> {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
    };
  }
}
