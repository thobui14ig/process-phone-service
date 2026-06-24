import { CookieEntity, CookieStatus } from '@domain/entities/cookie.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class CookieRepository {
  constructor(
    @InjectRepository(CookieEntity)
    private repo: Repository<CookieEntity>,
  ) {}

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCookieDto: Partial<CookieEntity>) {
    return this.repo.save({ ...updateCookieDto, id });
  }

  getAllCookieActive() {
    return this.repo.find({
      where: {
        status: In([CookieStatus.INACTIVE, CookieStatus.ACTIVE]),
      },
    });
  }

  async getCookieActiveFromDb(): Promise<CookieEntity> {
    const cookies = await this.getAllCookieActive();
    const randomIndex = Math.floor(Math.random() * cookies.length);
    const randomCookie = cookies[randomIndex];

    return randomCookie;
  }

  updateStatusCookie(cookie: CookieEntity, status: CookieStatus) {
    return this.repo.save({ ...cookie, status });
  }

  async updateActiveAllCookie() {
    const allCookie = await this.repo.find({
      where: {
        status: CookieStatus.LIMIT,
      },
    });

    return this.repo.save(
      allCookie.map((item) => {
        return {
          ...item,
          status: CookieStatus.ACTIVE,
        };
      }),
    );
  }

  deleteCookieDie() {
    return this.repo.delete({ status: CookieStatus.DIE });
  }
}
