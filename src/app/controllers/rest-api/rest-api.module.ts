import { Module } from '@nestjs/common';
import { CronjobControlerModule } from './cronjob/cronjob.controller.module';

const controllerModules = [CronjobControlerModule];
@Module({
  imports: [...controllerModules],
})
export class RestApiModule {}
