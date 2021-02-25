import { Subscribe } from '../subscribe.entity';

export interface SubscribeListDto {
  subscription: Subscribe[];
  subscriber: Subscribe[];
  friend: Subscribe[];
}
