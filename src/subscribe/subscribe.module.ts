import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { SubscribeRepository } from './subscribe.repository';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/auth/user.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscribeRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
  exports: [SubscribeService],
})
export class SubscribeModule {}
