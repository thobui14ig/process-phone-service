import { delay } from '@common/utils/helper';
import { CommentRepository } from '@infrastructure/repositories/comment-repository/comment-repository';
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { DataSource } from 'typeorm';


export enum LoadResource {
  COOKIE = 'cookie-active',
  PROXY_CMT = 'proxy-cmt',
  PROXY_INFO = 'proxy-info',
  PROXY_PAGE = 'proxy-page',
  TOKEN = 'token-active',
  FB_NUMBER = 'fb-number-active',
}


@Injectable()
export class AutoUpdatePhoneNumberV1UseCase {
  isRuning = false;
  constructor(
    private commentRepository: CommentRepository,
    private connection: DataSource
  ) {}

  async execute() {
    if (this.isRuning) return;
    this.isRuning = true;

    const BATCH_SIZE = 10000;

    try {
      const cmts = await this.commentRepository.getTodayComments();
      if (cmts.length < 300) return;
      console.log(`Có ${cmts.length} comment đang chờ`);

      if (!cmts.length) return

      for (let i = 0; i < cmts.length; i += BATCH_SIZE) {
        const batch = cmts.slice(i, i + BATCH_SIZE);

        console.log(
          `Đang xử lý batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(cmts.length / BATCH_SIZE)} (${batch.length} comment)`
        );

        const uids = batch.map(cmt => cmt.userUid);

        const uidPhones = await this.main(uids);

        console.log('Bước 2: Update UID');

        const commentsUpdate = batch.map(cmt => ({
          ...cmt,
          phoneNumber: uidPhones[cmt.userUid] ?? cmt.phoneNumber,
          isProcessPhone: true,
        }));

        const SAVE_BATCH_SIZE = 200;

        for (let i = 0; i < commentsUpdate.length; i += SAVE_BATCH_SIZE) {
          const chunk = commentsUpdate.slice(i, i + SAVE_BATCH_SIZE);
          const updates = chunk.map((cmt) => ({
            id: cmt.id,
            phone_number: uidPhones[cmt.userUid] ?? cmt.phoneNumber,
            is_process_phone: true,
          }));  
          await this.connection.query(
            `
            UPDATE comments c
            SET
              phone_number = u.phone_number,
              is_process_phone = u.is_process_phone
            FROM (
              SELECT *
              FROM json_to_recordset($1::json)
                AS x(
                  id bigint,
                  phone_number text,
                  is_process_phone boolean
                )
            ) u
            WHERE c.id = u.id
            `,
            [JSON.stringify(updates)],
          );

          console.log(
            `Saved ${Math.min(i + SAVE_BATCH_SIZE, commentsUpdate.length)}/${commentsUpdate.length}`,
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      console.log('Thành công');
      this.isRuning = false;
    }
  }

  async main(uids: string []) {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
    );

    await page.setViewport({
      width: 1366,
      height: 768,
    });

    page.on('requestfailed', req => {
      console.log(
        'REQUEST FAILED:',
        req.url(),
        req.failure()?.errorText
      );
    });

    page.on('response', res => {
      if (
        res.url().includes('login') ||
        res.url().includes('scan-multi')
      ) {
        console.log('RESPONSE:', res.status(), res.url());
      }
    });

    await page.goto('https://uidphone.shop/login', {
      waitUntil: 'networkidle2',
    });

    await page.waitForSelector('input[name="email"]');

    await page.type(
      'input[name="email"]',
      'Surimin241094@gmail.com',
      { delay: 50 }
    );

    await page.type(
      'input[name="password"]',
      '123456',
      { delay: 50 }
    );
    await delay(1000)
    await page.click('#btn-login-register');

    // Chờ tối đa 30s để URL đổi khỏi /login
    try {
      await page.waitForFunction(
        () => location.pathname !== '/login',
        { timeout: 30000 }
      );
    } catch {
      console.log('Không thấy chuyển trang.');
    }

    console.log('URL:', page.url());
    console.log('TITLE:', await page.title());

    // Nếu vẫn ở login thì dừng
    if (page.url().includes('/login')) {
      console.log('Đăng nhập chưa thành công.');
      await new Promise(() => {});
      return;
    }

    console.log('Đã đăng nhập.');
    await delay(1000)
    await page.goto('https://uidphone.shop/scan-multi', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('SCAN URL:', page.url());

    await page.waitForSelector('#uid2phone-multi-name');

    await page.type('#uid2phone-multi-name', 'abc');

    console.log('Đã nhập tên danh sách.');

    await page.waitForSelector('#uid2phone-multi-uids');

    // const uids = [
    // '100007241507004',
    // '100004215614409',
    // '100010645350306',
    // '100009259609534'
    // ];
    // Nhập danh sách UID
    await page.$eval(
      '#uid2phone-multi-uids',
      (el, value) => {
        (el as any).value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      },
      uids.join('\n')
    );
    console.log('Đã nhập danh sách UID');
    await page.waitForSelector('#uid2phone-multi-btn');
    await delay(1000)
    // Click
    await page.click('#uid2phone-multi-btn');

    console.log('Đã click Chuyển đổi');
    const [response] = await Promise.all([
      page.waitForResponse(
        res =>
          res.url().includes('/convert-uid-to-phone-multi') &&
          res.status() === 200,
        { timeout: 60000 }
      ),
      page.click('#uid2phone-multi-btn'),
    ]);
    const data = await response.json();
    console.log("2222", data.data)
    const map = {};

    data.result
      .trim()
      .split('\n')
      .forEach(line => {
        const [uid, phone] = line.split('|');
        map[uid] = phone;
      });
    await browser.close();
    return map
  }
}
