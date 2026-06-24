import {
  TokenEntity,
  TokenHandle,
  TokenStatus,
} from '@domain/entities/token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { delay } from 'rxjs';
import { In, Repository } from 'typeorm';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private repo: Repository<TokenEntity>,
  ) {}

  async getTokenGetInfoActiveFromDb(): Promise<TokenEntity> {
    const tokens = await this.repo.find({
      where: {
        status: In([TokenStatus.ACTIVE]),
        type: TokenHandle.GET_INFO,
      },
    });

    if (tokens.length === 0) {
      // await delay(5000);
      // return this.getTokenGetInfoActiveFromDb();
      return null
    }
    const randomIndex = Math.floor(Math.random() * tokens?.length);
    const randomToken = tokens[randomIndex];

    return randomToken;
  }

  async getAllTokenActive(): Promise<TokenEntity[]> {
    return await this.repo.find({
      where: {
        status: In([TokenStatus.ACTIVE]),
        // tokenValueV1: Not(IsNull()),
      },
    });
  }

  updateStatusToken(token: TokenEntity, status: TokenStatus) {
    return this.repo.save({ ...token, status });
  }

  save(tokens: Partial<TokenEntity[]>) {
    return this.repo.save(tokens);
  }

  deleteAll() {
    return this.repo.deleteAll();
  }
}
