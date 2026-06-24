// redis.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setJson(key: string, value: any): Promise<'OK'> {
    return this.redis.set(key, JSON.stringify(value));
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async SLAVEOF() {
    return await this.redis.call('SLAVEOF', ['NO', 'ONE']);
  }

  get(key: string) {
    return this.redis.get(key);
  }
}
