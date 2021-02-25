import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  UseGuards,
  ParseBoolPipe,
  Get,
  Param,
} from '@nestjs/common';
import { PrivateKeyGuard } from 'src/guard/private-key.guard';
import { OnlineStatusService } from './online-status.service';
import { OnlineStatus } from './online-status.entity';

@Controller('online-status')
export class OnlineStatusController {
  constructor(private onlineStatusService: OnlineStatusService) {}

  @UseGuards(PrivateKeyGuard)
  @Post('/api/user')
  async apiUpdateUserStatus(
    @Body('status', ParseBoolPipe) status: boolean,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<OnlineStatus> {
    return this.onlineStatusService.updateUserStatus(userId, status);
  }

  @Get('/user/:id')
  async getUserStatusById(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<OnlineStatus> {
    return this.onlineStatusService.getUserStatus(userId);
  }
}
