import { Module } from '@nestjs/common';
import { AutoUpdatePhoneNumberUseCase } from './auto-update-phone-number-usecase';
import { HttpModule } from '@nestjs/axios';
import { ProxyRepositoryModule } from '@infrastructure/repositories/proxy-repository';
import { CommentRepositoryModule } from '@infrastructure/repositories/comment-repository/comment-repository.module';

@Module({
  imports: [
    HttpModule,
    ProxyRepositoryModule,
    CommentRepositoryModule,
  ],
  providers: [AutoUpdatePhoneNumberUseCase],
  exports: [AutoUpdatePhoneNumberUseCase],
})
export class AutoUpdatePhoneNumberUseCaseModule {}
