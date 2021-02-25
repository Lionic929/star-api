import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  UseGuards,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { AuthGuard } from '@nestjs/passport';
import { UserGuard } from 'src/guard/user.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Subscribe } from './subscribe.entity';

@Controller('subscribe')
export class SubscribeController {
  constructor(private subscribeService: SubscribeService) {}

  @Post('/:id')
  @UseGuards(AuthGuard(), UserGuard)
  async setUserSubscribe(
    @Param('id', ParseIntPipe) targetId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.subscribeService.setUserSubscribe(user, targetId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), UserGuard)
  async removeUserSubscribe(
    @Param('id', ParseIntPipe) targetId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.subscribeService.removeUserSubscribe(user, targetId);
  }

  @Get('/subscription')
  @UseGuards(AuthGuard(), UserGuard)
  async getSubscribe(
    @GetUser() user: User,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<Subscribe[]> {
    return this.subscribeService.getSubscriptionList(user, offset, limit);
  }

  @Get('/subscriber')
  @UseGuards(AuthGuard(), UserGuard)
  async getSubscriber(
    @GetUser() user: User,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<Subscribe[]> {
    return this.subscribeService.getSubscriberList(user, offset, limit);
  }

  @Get('/friend')
  @UseGuards(AuthGuard(), UserGuard)
  async getFriend(
    @GetUser() user: User,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<Subscribe[]> {
    return this.subscribeService.getFriendList(user, offset, limit);
  }
}
