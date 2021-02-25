import { Repository, EntityRepository } from 'typeorm';
import { Subscribe } from './subscribe.entity';
import { User } from 'src/auth/user.entity';

@EntityRepository(Subscribe)
export class SubscribeRepository extends Repository<Subscribe> {
  async getSubscriptionList(
    user: User,
    offset: number,
    limit: number,
  ): Promise<Subscribe[]> {
    const query = this.createQueryBuilder('subscribe');

    query.leftJoinAndSelect('subscribe.subscriber', 'subscriber');
    query.leftJoinAndSelect('subscribe.subscribeTarget', 'subscribeTarget');

    query.where(
      '(subscriber.id = :id AND subscribe.subscriberConfirm = TRUE AND subscribe.subscribeTargetConfirm = FALSE) OR (subscribeTarget.id = :id AND subscribe.subscribeTargetConfirm = TRUE AND subscribe.subscriberConfirm = FALSE)',
      {
        id: user.id,
      },
    );

    query.offset(offset);
    query.limit(limit);

    query.select([
      'subscribe.id',
      'subscribe.updateDate',
      'subscribe.createDate',
      'subscribeTarget.login',
      'subscribeTarget.id',
      'subscriber.login',
      'subscriber.id',
      'subscribe.subscribeTargetConfirm',
      'subscribe.subscriberConfirm',
    ]);

    return query.getMany();
  }

  async getSubscriberList(
    user: User,
    offset: number,
    limit: number,
  ): Promise<Subscribe[]> {
    const query = this.createQueryBuilder('subscribe');

    query.leftJoinAndSelect('subscribe.subscriber', 'subscriber');
    query.leftJoinAndSelect('subscribe.subscribeTarget', 'subscribeTarget');

    query.where(
      '(subscriber.id = :id AND subscribe.subscriberConfirm = FALSE AND subscribe.subscribeTargetConfirm = TRUE) OR (subscribeTarget.id = :id AND subscribe.subscribeTargetConfirm = FALSE AND subscribe.subscriberConfirm = TRUE)',
      {
        id: user.id,
      },
    );

    query.offset(offset);
    query.limit(limit);

    query.select([
      'subscribe.id',
      'subscribe.updateDate',
      'subscribe.createDate',
      'subscribeTarget.login',
      'subscribeTarget.id',
      'subscriber.login',
      'subscriber.id',
      'subscribe.subscribeTargetConfirm',
      'subscribe.subscriberConfirm',
    ]);

    return query.getMany();
  }

  async getFriendList(
    user: User,
    offset: number,
    limit: number,
  ): Promise<Subscribe[]> {
    const query = this.createQueryBuilder('subscribe');

    query.leftJoinAndSelect('subscribe.subscriber', 'subscriber');
    query.leftJoinAndSelect('subscribe.subscribeTarget', 'subscribeTarget');

    query.where(
      '(subscriber.id = :id AND subscribe.subscriberConfirm = TRUE AND subscribe.subscribeTargetConfirm = TRUE) OR (subscribeTarget.id = :id AND subscribe.subscribeTargetConfirm = TRUE AND subscribe.subscriberConfirm = TRUE)',
      {
        id: user.id,
      },
    );

    query.offset(offset);
    query.limit(limit);

    query.select([
      'subscribe.id',
      'subscribe.updateDate',
      'subscribe.createDate',
      'subscribeTarget.login',
      'subscribeTarget.id',
      'subscriber.login',
      'subscriber.id',
      'subscribe.subscribeTargetConfirm',
      'subscribe.subscriberConfirm',
    ]);

    return query.getMany();
  }
}
