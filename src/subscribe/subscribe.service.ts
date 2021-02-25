import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeRepository } from './subscribe.repository';
import { Subscribe } from './subscribe.entity';
import { Errors } from './enum/errors.enum';
import { UserRepository } from 'src/auth/user.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(SubscribeRepository)
    private subscribeRepository: SubscribeRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async setUserSubscribe(user, targetId): Promise<void> {
    if (user.id === targetId) {
      throw new BadRequestException();
    }

    const targetUser = await this.userRepository.findOne(targetId);

    if (!user) {
      throw new NotFoundException(Errors.TARGET_USER_WITH_THIS_ID_NOT_FOUND);
    }

    const subscribeData: Subscribe = await this.subscribeRepository.findOne({
      where: [
        { subscribeTarget: targetUser, subscriber: user },
        { subscribeTarget: user, subscriber: targetUser },
      ],
    });

    if (subscribeData) {
      if (subscribeData.subscribeTarget.id === user.id) {
        await this.subscribeRepository.update(subscribeData.id, {
          subscribeTargetConfirm: true,
        });
      }

      if (subscribeData.subscriber.id === user.id) {
        await this.subscribeRepository.update(subscribeData.id, {
          subscriberConfirm: true,
        });
      }
    } else {
      const subscribe = new Subscribe();
      subscribe.subscribeTarget = targetUser;
      subscribe.subscriber = user;
      subscribe.subscriberConfirm = true;
      subscribe.subscribeTargetConfirm = false;

      await subscribe.save();
    }
  }

  async removeUserSubscribe(user, targetId): Promise<void> {
    if (user.id === targetId) {
      throw new BadRequestException();
    }

    const targetUser = await this.userRepository.findOne(targetId);

    if (!user) {
      throw new NotFoundException(Errors.TARGET_USER_WITH_THIS_ID_NOT_FOUND);
    }

    const subscribeData: Subscribe = await this.subscribeRepository.findOne({
      where: [
        { subscribeTarget: targetUser, subscriber: user },
        { subscribeTarget: user, subscriber: targetUser },
      ],
    });

    if (!subscribeData) {
      throw new NotFoundException(Errors.SUBSCRIBE_NOT_FOUND);
    }

    if (subscribeData.subscribeTarget.id === user.id) {
      subscribeData.subscribeTargetConfirm = false;
    }

    if (subscribeData.subscriber.id === user.id) {
      subscribeData.subscriberConfirm = false;
    }

    if (
      subscribeData.subscriberConfirm === false &&
      subscribeData.subscribeTargetConfirm === false
    ) {
      await this.subscribeRepository.delete({ id: subscribeData.id });
    } else {
      await this.subscribeRepository.update(subscribeData.id, {
        subscriberConfirm: subscribeData.subscriberConfirm,
        subscribeTargetConfirm: subscribeData.subscribeTargetConfirm,
      });
    }
  }

  async getSubscriptionList(
    user: User,
    offset: number,
    limit: number,
  ): Promise<Subscribe[]> {
    return this.subscribeRepository.getSubscriptionList(user, offset, limit);
  }

  async getSubscriberList(
    user: User,
    offset: number,
    limit: number,
  ): Promise<Subscribe[]> {
    return this.subscribeRepository.getSubscriberList(user, offset, limit);
  }

  async getFriendList(
    user: User,
    offset: number,
    limit: number,
  ): Promise<Subscribe[]> {
    return this.subscribeRepository.getFriendList(user, offset, limit);
  }
}
