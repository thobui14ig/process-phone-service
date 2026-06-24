import { GroupEntity } from '@domain/entities/group.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectRepository(GroupEntity)
    private repository: Repository<GroupEntity>,
  ) {}

  find() {
    return this.repository.find();
  }
}
