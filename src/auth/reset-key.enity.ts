import { randomUUID } from '../utils/hash';
import { InternalServerErrorException } from '@nestjs/common';
import { CacheEntity } from '../utils/cache';

const ResetKeyCache = new CacheEntity({
  stdTTL: 900,
  checkperiod: 900,
  deleteOnExpire: true,
  maxKeys: 1000000,
});

export class ResetKey {
  id: string;
  email: string;

  constructor() {
    this.id = randomUUID();
  }

  async save() {
    const saved = await ResetKeyCache.set(this.id, {
      email: this.email,
      createDate: new Date().getTime(),
    });
    if (!saved) {
      throw new InternalServerErrorException();
    }
  }

  async reset() {
    return ResetKeyCache.del(this.id);
  }

  static async delete({ id }): Promise<void> {
    await ResetKeyCache.del(id);
  }

  static async getOne({ id }): Promise<ResetKey> {
    return ResetKeyCache.get(id);
  }
}
