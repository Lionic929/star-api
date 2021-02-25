import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnlineStatusRepository } from './online-status.repository';
import { Errors } from './enum/errors.enum';
import { OnlineStatus } from './online-status.entity';

@Injectable()
export class OnlineStatusService {
  constructor(
    @InjectRepository(OnlineStatusRepository)
    private onlineStatusRepository: OnlineStatusRepository,
  ) {}

  async updateUserStatus(
    userId: number,
    status: boolean,
  ): Promise<OnlineStatus> {
    const onlineStatus = await this.onlineStatusRepository.findOne({
      where: { user: userId },
    });

    if (!onlineStatus) {
      throw new NotFoundException(Errors.ONLINE_STATUS_USER_NOT_FOUND);
    }

    onlineStatus.status = Boolean(status);
    return onlineStatus.save();
  }

  async getUserStatus(userId: number): Promise<OnlineStatus> {
    const onlineStatus = await this.onlineStatusRepository.findOne({
      where: { user: userId },
    });

    if (!onlineStatus) {
      throw new NotFoundException(Errors.ONLINE_STATUS_USER_NOT_FOUND);
    }

    return onlineStatus;
  }

  async createUserOnlineStatus(user): Promise<OnlineStatus> {
    const onlineStatus = new OnlineStatus();
    onlineStatus.status = false;
    onlineStatus.user = user;
    return this.onlineStatusRepository.save(onlineStatus);
  }
}
