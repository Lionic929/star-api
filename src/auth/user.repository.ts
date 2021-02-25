import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { Errors } from './enum/errors.enum';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { Balance } from 'src/balance/balance.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userSignUpDto: UserSignUpDto): Promise<User> {
    const { login, email, password } = userSignUpDto;

    const user: User = this.create();

    user.login = login;
    user.email = email || null;
    user.emailConfirm = false;
    user.password = await User.hashPassword(password);

    try {
      return user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(Errors.USERNAME_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<User> {
    const { login, password } = userLoginDto;

    const user = await this.findOne({
      where: [{ login }, { email: login }],
    });
    if (user === undefined) {
      throw new NotFoundException(Errors.COULDNT_FOUND_USER);
    } else {
      const passwordCorrect = await user.validatePassword(password);

      if (passwordCorrect === false) {
        throw new BadRequestException(Errors.UNCORRECT_PASSWORD_OR_LOGIN);
      } else {
        return user;
      }
    }
  }
}
