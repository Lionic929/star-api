import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Errors } from './enum/errors.enum';

@Injectable({ scope: Scope.REQUEST })
export class SettingsService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async updatePassword(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { newPassword } = updatePasswordDto;

    user.password = await User.hashPassword(newPassword);
    await user.save();
  }

  async updateEmail(
    currentUser: User,
    updateEmailDto: UpdateEmailDto,
  ): Promise<void> {
    const { email } = updateEmailDto;

    const user: User = await this.userRepository.findOne({ where: { email } });

    if (user) {
      if (user.id === currentUser.id) {
        throw new BadRequestException(Errors.NEW_EMAIL_IS_CURRENT);
      } else {
        throw new BadRequestException(Errors.USER_WITH_THIS_EMAIL_EXISTS);
      }
    }

    currentUser.email = email;
    await currentUser.save();
  }
}
