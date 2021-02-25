import { randomUUID } from '../utils/hash';
import { InternalServerErrorException } from '@nestjs/common';
import { CacheEntity } from '../utils/cache';
import { ConfirmProps } from './interface/confirm-props.interface';

const ConfirmKeyCache = new CacheEntity({
  stdTTL: 900,
  checkperiod: 900,
  deleteOnExpire: true,
  maxKeys: 1000000,
});

export class ConfirmKey {
  id: string;
  email: string;
  props: ConfirmProps;

  constructor() {
    this.id = randomUUID();
  }

  async save() {
    const saved = await ConfirmKeyCache.set(this.id, {
      email: this.email,
      props: this.props,
      createDate: new Date().getTime(),
    });
    if (!saved) {
      throw new InternalServerErrorException();
    }
  }

  async reset() {
    return ConfirmKeyCache.del(this.id);
  }

  static async delete({ id }): Promise<void> {
    await ConfirmKeyCache.del(id);
  }

  static async getOne({ id }): Promise<ConfirmKey> {
    return ConfirmKeyCache.get(id);
  }
}
