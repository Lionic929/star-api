import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from '../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { ConfirmService } from './confirm.service';
import { ResetService } from './reset.service';
import { SettingsService } from './settings.service';
import { MessageService } from 'src/message/message.service';
import { BalanceService } from 'src/balance/balance.service';
import { OnlineStatusService } from 'src/online-status/online-status.service';
import { BalanceRepository } from 'src/balance/balance.repository';
import { OnlineStatusRepository } from 'src/online-status/online-status.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JwtConfig),
    TypeOrmModule.forFeature([
      UserRepository,
      BalanceRepository,
      OnlineStatusRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfirmService,
    ResetService,
    SettingsService,
    MessageService,
    BalanceService,
    OnlineStatusService,
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
