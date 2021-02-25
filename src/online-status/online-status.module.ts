import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineStatusService } from './online-status.service';
import { OnlineStatusController } from './online-status.controller';
import { OnlineStatusRepository } from './online-status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OnlineStatusRepository])],
  controllers: [OnlineStatusController],
  providers: [OnlineStatusService],
  exports: [OnlineStatusService],
})
export class OnlineStatusModule {}
