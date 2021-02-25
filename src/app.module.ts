import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { BalanceModule } from './balance/balance.module';
import { OnlineStatusModule } from './online-status/online-status.module';
import { SubscribeModule } from './subscribe/subscribe.module';

@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MessageModule,
    BalanceModule,
    OnlineStatusModule,
    SubscribeModule,
  ],
})
export class AppModule {}
