import { AutoUpdatePhoneNumberV1UseCase } from '@application/auto-update-phone-number-v1/auto-update-phone-number-v1-usecase';
import { AutoUpdatePhoneNumberUseCase } from '@application/auto-update-phone-number/auto-update-phone-number-usecase';
import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class CronjobControler {
  constructor(
    private readonly autoUpdatePhoneNumberUseCase: AutoUpdatePhoneNumberUseCase,
    private readonly autoUpdatePhoneNumberV1UseCase: AutoUpdatePhoneNumberV1UseCase,

  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updatePhoneNumber() {
    await this.autoUpdatePhoneNumberUseCase.execute();
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async updatePhoneNumberV1() {
  //   await this.autoUpdatePhoneNumberV1UseCase.execute();
  // }
}
