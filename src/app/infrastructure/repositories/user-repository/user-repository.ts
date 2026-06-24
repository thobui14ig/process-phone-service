import { UserEntity } from '@domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
    private connection: DataSource,
  ) {}

  getAllUser() {
    return this.connection.query(`
        select 
        id,
        expired_at::TEXT as "expiredAt"
        from users 
        where is_active = true and level = 0
    `);
  }

  save(user: Partial<UserEntity>) {
    return this.repo.save(user);
  }
}
