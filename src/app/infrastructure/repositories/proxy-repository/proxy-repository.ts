import { LoadResource } from '@application/auto-update-phone-number/auto-update-phone-number-usecase';
import {
  ProxyEntity,
  ProxyStatus,
  ProxyType,
} from '@domain/entities/proxy.entity';
import { RedisService } from '@infrastructure/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProxyRepository {
  proxies: ProxyEntity[] = [];
  constructor(
    @InjectRepository(ProxyEntity)
    private repo: Repository<ProxyEntity>,
    private readonly redisService: RedisService,
  ) {}

  getAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  getAllProxyActive(type: ProxyType) {
    return this.repo.find({
      where: {
        status: ProxyStatus.ACTIVE,
        type,
      },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  updateProxyBlock() {
    return this.repo.update(
      { isFbBlock: false },
      { status: ProxyStatus.ACTIVE },
    );
  }

  async getRandomProxy(type: ProxyType, typeResource: LoadResource) {
    const dataRedis = await this.redisService.get(typeResource);
    let proxy = null;
    let proxies = [];
    if (dataRedis) {
      proxies = JSON.parse(dataRedis);
    } else {
      proxies = await this.getAllProxyActive(type);
    }
    const randomIndex = Math.floor(Math.random() * proxies?.length);
    proxy = proxies[randomIndex];

    return proxy ?? null;
  }

  updateProxyFbBlock(proxy: ProxyEntity) {
    return this.repo.update(proxy.id, { isFbBlock: true });
  }

  updateProxyActive(proxy: ProxyEntity) {
    return this.repo.update(proxy.id, { status: ProxyStatus.ACTIVE });
  }

  updateProxyDie(proxy: ProxyEntity) {
    return this.repo.update(proxy.id, { status: ProxyStatus.IN_ACTIVE });
  }

  save(proxy: ProxyEntity) {
    const { id, ...props } = proxy;
    return this.repo.update(id, { ...props });
  }

  //
  async getFbNumber() {
    const dataRedis = await this.redisService.get(LoadResource.FB_NUMBER);
    if (dataRedis) {
      const fbNumbers = JSON.parse(dataRedis);

      return fbNumbers?.[0]?.value ?? null
    } 

    return null
  }
}
