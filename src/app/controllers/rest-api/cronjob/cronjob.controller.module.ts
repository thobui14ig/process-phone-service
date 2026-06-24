import { AutoUpdatePhoneNumberUseCaseModule } from '@application/auto-update-phone-number/auto-update-phone-number-usecase-module';
import { Module } from '@nestjs/common';
import { CronjobControler } from './cronjob.controller';

@Module({
  imports: [
    AutoUpdatePhoneNumberUseCaseModule,
  ],
  controllers: [CronjobControler],
})
export class CronjobControlerModule {}
