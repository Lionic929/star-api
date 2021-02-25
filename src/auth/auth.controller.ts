import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { LoginInfo } from './interface/login-info.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './user.entity';
import { UserGuard } from '../guard/user.guard';
import { RateLimitGuard, RateLimit } from 'src/guard/rate-limit.guard';
import { PasswordGuard } from './guard/password.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UserResetAuthDto } from './dto/user-reset-auth.dto';
import { ConfirmService } from './confirm.service';
import { ResetService } from './reset.service';
import { SettingsService } from './settings.service';
import { AccountInfoDto } from './dto/account-info.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private confirmService: ConfirmService,
    private resetService: ResetService,
    private settingsService: SettingsService,
  ) {}

  @Post('/signup')
  @RateLimit(10)
  @UseGuards(RateLimitGuard)
  async signUp(
    @Body(ValidationPipe) userSignUpDto: UserSignUpDto,
  ): Promise<LoginInfo> {
    return this.authService.signUp(userSignUpDto);
  }

  @Post('/login')
  logIn(@Body(ValidationPipe) userLoginDto: UserLoginDto): Promise<LoginInfo> {
    return this.authService.login(userLoginDto);
  }

  @Get('/confirm/:email')
  @RateLimit(15)
  @UseGuards(RateLimitGuard)
  async getConfirmCode(@Param('email') email: string): Promise<void> {
    const code = await this.confirmService.getConfirmCode(email);
  }

  @Post('/confirm/:code')
  async postConfirmation(
    @Param('code') code: string,
    @Body(ValidationPipe) authConfirmData,
  ): Promise<LoginInfo> {
    return this.confirmService.confirmSignup(code, authConfirmData);
  }

  @Get('/reset/:email')
  @RateLimit(30)
  @UseGuards(RateLimitGuard)
  async getResetCode(@Param('email') email: string): Promise<void> {
    await this.resetService.getResetCode(email);
  }

  @Post('/reset/:code')
  async postReset(
    @Param('code') code: string,
    @Body(ValidationPipe) userResetAuthDto: UserResetAuthDto,
  ): Promise<LoginInfo | void> {
    return this.resetService.resetPassword(code, userResetAuthDto);
  }

  @Get('/token')
  @UseGuards(AuthGuard())
  checkToken(@GetUser() user: User): void {}

  @Get('/account-info')
  @UseGuards(AuthGuard())
  getAccountInfo(@GetUser() user: User): Promise<AccountInfoDto> {
    return this.authService.getAccountInfo(user);
  }

  @Patch('/settings/password')
  @UseGuards(AuthGuard(), UserGuard, PasswordGuard)
  updatePassword(
    @Body(ValidationPipe)
    updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.settingsService.updatePassword(user, updatePasswordDto);
  }

  @Patch('/settings/email')
  @UseGuards(AuthGuard(), UserGuard, PasswordGuard)
  updateEmail(
    @Body(ValidationPipe)
    updateEmailDto: UpdateEmailDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.settingsService.updateEmail(user, updateEmailDto);
  }
}
