import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyRepositoryModule } from '@infrastructure/repositories/proxy-repository';
import { CommentRepositoryModule } from '@infrastructure/repositories/comment-repository/comment-repository.module';
import { AutoUpdatePhoneNumberV1UseCase } from './auto-update-phone-number-v1-usecase';

@Module({
  imports: [
    HttpModule,
    ProxyRepositoryModule,
    CommentRepositoryModule,
  ],
  providers: [AutoUpdatePhoneNumberV1UseCase],
  exports: [AutoUpdatePhoneNumberV1UseCase],
})
export class AutoUpdatePhoneNumberV1UseCaseModule {}
