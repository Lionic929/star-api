import { Injectable, Scope, BadRequestException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Errors } from 'src/auth/enum/errors.enum';
import { User } from './user.entity';
import { ConfirmProps } from './interface/confirm-props.interface';
import { ConfirmKey } from './confirm-key.enity';
import { ConfirmInfoDto } from './dto/confirn-info.dto';
import { MessageService } from 'src/message/message.service';
import { AuthService } from './auth.service';
import { LoginInfo } from './interface/login-info.interface';

@Injectable({ scope: Scope.REQUEST })
export class ConfirmService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
  ) {}

  async getConfirmCode(email: string): Promise<void> {
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException(Errors.COULDNT_FOUND_USER);
    }

    const isConfirm = user.isConfirm();

    if (isConfirm) {
      throw new BadRequestException(Errors.USER_ALREADY_CONFIRMED);
    }

    const confirmProps: ConfirmProps = {
      email: !user.emailConfirm,
    };

    const confirmKey = new ConfirmKey();
    confirmKey.email = email;
    confirmKey.props = confirmProps;

    await confirmKey.reset();
    await confirmKey.save();

    this.messageService.sendSignupConfirmMessage(
      user.email,
      confirmKey.id,
      confirmKey.props,
    );
  }

  async confirmSignup(codeId, authConfirmData): Promise<LoginInfo> {
    const confirmKey = await ConfirmKey.getOne({ id: codeId });
    if (!confirmKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }

    const { email, props } = confirmKey;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException();
    }

    if (props.email) {
      user.emailConfirm = true;
    }

    ConfirmKey.delete({ id: codeId });
    await user.save();

    return this.authService.updateLogin(user);
  }

  async getConfirmInfo(codeId): Promise<ConfirmInfoDto> {
    const confirmKey = await ConfirmKey.getOne({ id: codeId });
    if (!confirmKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }

    const { email } = confirmKey;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException();
    }

    const confirmInfoDto: ConfirmInfoDto = {
      confirmStatus: {
        email: user.emailConfirm,
      },
    };

    return confirmInfoDto;
  }
}
