import { CommentEntity } from '@domain/entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Repository } from 'typeorm';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class CommentRepository {
  vnTimezone = 'Asia/Bangkok';
  constructor(
    @InjectRepository(CommentEntity)
    private repo: Repository<CommentEntity>,
  ) {}

  save(comment: CommentEntity) {
    return this.repo.save(comment);
  }

  upsert(comments: CommentEntity[]) {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into('comments')
      .values(comments)
      .onConflict(`("link_id", "cmt_id") DO NOTHING`)
      .execute();
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  getCommentCrawlUuid() {
    return this.repo
      .createQueryBuilder('comment')
      .where('comment.user_uid LIKE :like1', { like1: 'Y29tb%' })
      .orWhere('comment.user_uid LIKE :like2', { like2: '%pfbid%' })
      .getMany();
  }

  async getTodayComments() {
    return this.repo
      .createQueryBuilder('c')
      .innerJoin('links', 'l', 'c.link_id = l.id')
      .innerJoin('users', 'u', 'l.user_id = u.id')
      .where(`c.created_at >= NOW() - INTERVAL '24 hours'`)
      .andWhere('c.phone_number IS NULL')
      .andWhere('c.is_process_phone = FALSE')
      .andWhere('u.is_get_phone = true')
      .andWhere(
        '(c.user_uid NOT LIKE :like1 AND c.user_uid NOT LIKE :like2)',
        {
          like1: 'Y29tb%',
          like2: '%pfbid%',
        },
      )
      .orderBy('CASE WHEN u.id = 4 THEN 0 ELSE 1 END', 'ASC')
      .addOrderBy('c.created_at', 'DESC')
      .getMany();
  }
}
