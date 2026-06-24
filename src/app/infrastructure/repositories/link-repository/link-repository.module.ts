import { LinkEntity } from '@domain/entities/links.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkRepository } from './link-repository';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity])],
  providers: [LinkRepository],
  exports: [LinkRepository],
})
export class LinkRepositoryModule {}
