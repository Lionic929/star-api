import { Injectable, Scope, BadRequestException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Errors } from 'src/auth/enum/errors.enum';
import { User } from './user.entity';
import { ResetKey } from './reset-key.enity';
import { UserResetAuthDto } from './dto/user-reset-auth.dto';
import { MessageService } from 'src/message/message.service';
import { AuthService } from './auth.service';
import { LoginInfo } from './interface/login-info.interface';

export class ResetService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
  ) {}

  async getResetCode(email: string): Promise<void> {
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException(
        Errors.COULDNT_FOUND_USER_BY_EMAIL_FOR_RESET,
      );
    }

    const resetKey = new ResetKey();
    resetKey.email = email;

    await resetKey.reset();
    await resetKey.save();

    const logger = new Logger('LoggerInfoError');
    logger.log('### CONFIRM KEY');
    logger.log(`### KEY: ${resetKey.id}`);
    logger.log('### CONFIRM KEY');

    this.messageService.sendAccountRecoveryMessage(user.email, resetKey.id);
  }

  async resetPassword(
    codeId,
    userResetAuthDto: UserResetAuthDto,
  ): Promise<LoginInfo | void> {
    const resetKey = await ResetKey.getOne({ id: codeId });

    if (!resetKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }

    const { email } = resetKey;

    const user: User = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException();
    }

    const { password } = userResetAuthDto;
    user.password = await User.hashPassword(password);

    ResetKey.delete({ id: codeId });
    await user.save();

    const loginInfo: LoginInfo = await this.authService.updateLogin(user);
    return loginInfo;
  }
}
