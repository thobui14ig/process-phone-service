import { Module } from '@nestjs/common';
import { ProxyRepository } from './proxy-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyEntity } from '@domain/entities/proxy.entity';
import { RedisModule } from '@infrastructure/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProxyEntity]), RedisModule],
  providers: [ProxyRepository],
  exports: [ProxyRepository],
})
export class ProxyRepositoryModule {}
