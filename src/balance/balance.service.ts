import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceRepository } from './balance.repository';
import { Balance } from './balance.entity';
import { Errors } from './enum/errors.enum';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceRepository)
    private balanceRepository: BalanceRepository,
  ) {}

  async replenishUserBalance(userId: number, amount: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: { user: userId },
    });

    if (!balance) {
      throw new NotFoundException(Errors.BALANCE_USER_NOT_FOUND);
    }

    balance.amount += amount;
    return balance.save();
  }

  async withdrawUserBalance(userId: number, amount: number): Promise<Balance> {
    const balance = await this.balanceRepository.findOne({
      where: { user: userId },
    });

    if (!balance) {
      throw new NotFoundException(Errors.BALANCE_USER_NOT_FOUND);
    }

    balance.amount -= amount;
    return balance.save();
  }

  async createUserBalance(user): Promise<Balance> {
    const balance = new Balance();
    balance.user = user;
    return this.balanceRepository.save(balance);
  }

  async getAccountBalance(user): Promise<Balance> {
    return this.balanceRepository.findOne({
      where: { user: user.id },
    });
  }
}
