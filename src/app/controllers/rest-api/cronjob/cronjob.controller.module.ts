import { AutoUpdatePhoneNumberUseCaseModule } from '@application/auto-update-phone-number/auto-update-phone-number-usecase-module';
import { Module } from '@nestjs/common';
import { CronjobControler } from './cronjob.controller';
import { AutoUpdatePhoneNumberV1UseCaseModule } from '@application/auto-update-phone-number-v1/auto-update-phone-number-v1-usecase-module';

@Module({
  imports: [
    AutoUpdatePhoneNumberUseCaseModule,
    AutoUpdatePhoneNumberV1UseCaseModule
  ],
  controllers: [CronjobControler],
})
export class CronjobControlerModule {}
