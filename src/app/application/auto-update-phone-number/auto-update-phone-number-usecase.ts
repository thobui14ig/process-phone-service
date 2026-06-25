import { delay, getHttpAgent, getRandomDelay } from '@common/utils/helper';
import { ProxyType } from '@domain/entities/proxy.entity';
import { CommentRepository } from '@infrastructure/repositories/comment-repository/comment-repository';
import { ProxyRepository } from '@infrastructure/repositories/proxy-repository';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { DataSource } from 'typeorm';

export enum LoadResource {
  COOKIE = 'cookie-active',
  PROXY_CMT = 'proxy-cmt',
  PROXY_INFO = 'proxy-info',
  PROXY_PAGE = 'proxy-page',
  TOKEN = 'token-active',
}


@Injectable()
export class AutoUpdatePhoneNumberUseCase {
  isRuning = false;
  constructor(
    private commentRepository: CommentRepository,
    private proxyRepository: ProxyRepository,
    private connection: DataSource,
  ) {}

  async execute() {
    if (this.isRuning) return;
    this.isRuning = true;
    const cmts = await this.commentRepository.getTodayComments();
    console.log('cmt', cmts.length);
    for (const cmt of cmts) {
      const { userUid, cmtId } = cmt;

      try {
        const phone = await this.callApi(userUid);
        if (phone === 429) {
          console.log('Rate limit');
          await delay(5000);
          this.isRuning = false;
          break; // thoát loop
        }
        if (phone === 'error') {
          console.log('Errorrr');
          continue;
        }
        console.log(userUid, phone);
        if (phone) {
          cmt.phoneNumber = phone;
        }
        cmt.isProcessPhone = true;
        await this.commentRepository.save(cmt);
      } catch (error) {
        console.log('Loi lay sdt', error);
      } finally {
        const ms = getRandomDelay(300, 500);
        await delay(ms);
      }
    }
    this.isRuning = false;
  }

  async callApi(uid: string) {
    try {
      const proxy = await this.proxyRepository.getRandomProxy(
        ProxyType.GET_CMT,
        LoadResource.PROXY_CMT,
      );
      if (!proxy) return 'error'; 
      const httpsAgent = getHttpAgent(proxy);
      const res = await fetch(
        `https://fbnumber.com/api/v1/phone/find-info-by-phone?searchPhone=${uid}`,
        {
          agent: httpsAgent,
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
              "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1SWQiOiI2OWU3OTZiZmEwMzVhMGNiMTc2YjhlZGEiLCJzSWQiOiJsU1hPaEFmR2pQV3JRWEdFV2JLYnYiLCJpYXQiOjE3ODIyODUyNzQsImV4cCI6MTc4MzE0OTI3NH0.CSmaeZM73cEvr5e6xZ9Y3tcqe1tEm7VE2-0YIZGRHxA",
            priority: 'u=1, i',
            'sec-ch-ua':
              '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"iOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            Referer: 'https://app.fbnumber.com/',
          },
          body: null,
          method: 'GET',
        },
      );

      const result = await res.json();
      if (result?.status === 'success' && result?.data?.number) {
        return result?.data?.number;
      }
      if (result?.status === 'error' && result?.code === '429') {
        return 429;
      }
      if (result?.status === 'error' && result?.code === 'UNAUTHORIZED') {
        return "error";
      }     

      return null;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  upsertUsersFacebook() {
    return this.connection.query(`
        INSERT INTO users_facebook (uid, phone_number, username)
        SELECT c.user_uid, c.phone_number, c.username
        FROM comments c
        WHERE c.phone_number IS NOT NULL
      ON CONFLICT (uid) DO NOTHING`);
  }
}
