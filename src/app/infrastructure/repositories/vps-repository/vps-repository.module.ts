import { VpsEntity } from '@domain/entities/vps.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VpsRepository } from './vps-repository';

@Module({
  imports: [TypeOrmModule.forFeature([VpsEntity])],
  providers: [VpsRepository],
  exports: [VpsRepository],
})
export class VpsRepositoryModule {}
