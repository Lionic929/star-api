import { Repository, EntityRepository } from 'typeorm';
import { OnlineStatus } from './online-status.entity';

@EntityRepository(OnlineStatus)
export class OnlineStatusRepository extends Repository<OnlineStatus> {}
