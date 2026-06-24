import { VpsEntity, VpsStatus } from '@domain/entities/vps.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VpsRepository {
  constructor(
    @InjectRepository(VpsEntity)
    private repo: Repository<VpsEntity>,
  ) {}

  getVpsLive() {
    return this.repo.find({
      where: {
        status: VpsStatus.Live,
      },
    });
  }

  findAll() {
    return this.repo.find({
      order: {
        id: 'DESC',
      },
    });
  }

  update(id: number, dto: Partial<VpsEntity>) {
    return this.repo.update(id, dto);
  }
}
