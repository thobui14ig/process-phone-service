import { AutoUpdatePhoneNumberUseCase } from '@application/auto-update-phone-number/auto-update-phone-number-usecase';
import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class CronjobControler {
  constructor(
    private readonly autoUpdatePhoneNumberUseCase: AutoUpdatePhoneNumberUseCase,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  updatePhoneNumber() {
    return this.autoUpdatePhoneNumberUseCase.execute();
  }
}
