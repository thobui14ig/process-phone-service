import { GroupEntity } from '@domain/entities/group.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from './group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupRepository],
  exports: [GroupRepository],
})
export class GroupRepositoryModule {}
