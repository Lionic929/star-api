import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from './balance.entity';
import { PrivateKeyGuard } from 'src/guard/private-key.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('balance')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @UseGuards(PrivateKeyGuard)
  @Post('/api/replenish-user')
  async apiReplenishUserBalance(
    @Body('amount', ParseIntPipe) amount: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<Balance> {
    return this.balanceService.replenishUserBalance(userId, amount);
  }

  @Get('/account')
  @UseGuards(AuthGuard())
  getAccountInfo(@GetUser() user: User): Promise<Balance> {
    return this.balanceService.getAccountBalance(user);
  }

  @UseGuards(PrivateKeyGuard)
  @Post('/api/withdraw-user')
  async apiWithdrawUserBalance(
    @Body('amount', ParseIntPipe) amount: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<Balance> {
    return this.balanceService.withdrawUserBalance(userId, amount);
  }
}
