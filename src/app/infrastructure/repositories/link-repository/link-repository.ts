import {
  LinkEntity,
  LinkStatus,
  LinkType,
} from '@domain/entities/links.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  In,
  IsNull,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class LinkRepository {
  constructor(
    @InjectRepository(LinkEntity)
    private repo: Repository<LinkEntity>,
    private conenction: DataSource,
  ) {}

  update(linkId: number, params: Partial<LinkEntity>) {
    return this.repo.update(linkId, params);
  }

  getLinkOrtherId(postId: string) {
    return this.repo.findOne({
      where: {
        postId: Not(postId),
        type: LinkType.PRIVATE,
      },
    });
  }

  getPostStarted(): Promise<LinkEntity[]> {
    return this.conenction.query(`
     SELECT 
              link.id,
              link.post_id AS "postId",
              link.post_id_v1 AS "postIdV1", 
              link.delay_time AS "delayTime",
              link.link_url AS "linkUrl",
              link.type,
              page.id AS "pageId",
              page.is_active AS "pageIsActive"
            FROM links link
            LEFT JOIN page page ON page.page_id = link.page_id  
            join users u on u.id= link.user_id and u.is_active =true
            WHERE link.status IN ('started', 'pending')
              AND link.type NOT IN ('die', 'undefined')
              AND link.delay_time >= 0  
              AND link.is_deleted = false
              AND (
                link.page_id IS NULL 
                OR (link.page_id IS NOT NULL AND page.is_active = true)
              )
              and (link.type = 'public' or link.type ='private' and link.user_id=2)
      `);
  }

  getLinksWithoutProfile() {
    return this.repo.find({
      where: {
        process: false,
        postId: IsNull(),
        type: LinkType.UNDEFINED,
      },
    });
  }

  getLinkByUser(postId: string, userId: number) {
    return this.repo.findOne({
      where: {
        postId,
        userId,
        isDelete: true,
      },
    });
  }

  getAllLinkCrawlPostIdV1Null() {
    return this.repo.find({
      where: {
        status: In([LinkStatus.Started, LinkStatus.Pending]),
        type: In([LinkType.PUBLIC, LinkType.PRIVATE]),
        // type: In([LinkType.PUBLIC]),
        pageId: IsNull(),
        postIdV1: IsNull(),
      },
    });
  }

  getAllLinkUpdateInfo() {
    return this.repo
      .createQueryBuilder('l')
      .where('l.isLinkGroup = :isLinkGroup', { isLinkGroup: false })
      .andWhere('l.type NOT IN (:...types)', { types: [LinkType.DIE] })
      .andWhere(
        "(l.linkName IS NULL OR l.linkName = '') AND (l.content IS NULL OR l.content = '')",
      )
      .getMany();
  }

  getAllLinkProcessTotal() {
    return this.repo.find({
      where: {
        isLinkGroup: false,
        type: LinkType.PUBLIC,
        pageId: Not(IsNull()),
        userId: 3,
      },
    });
  }

  deleteLinkById(id: number) {
    return this.repo.delete(id);
  }

  save(link: DeepPartial<LinkEntity[]>) {
    return this.repo.save(link);
  }

  async getAllLinkGetOldCmt() {
    const currentDay = dayjs().utc().format('YYYY-MM-DD 00:00:00');

    return this.repo.find({
      where: {
        userId: In([67, 68, 79, 71]),
        isGetOldComment: false,
        createdAt: MoreThanOrEqual(currentDay) as any,
        type: In([LinkType.PUBLIC])
      },
    });
  }
}
