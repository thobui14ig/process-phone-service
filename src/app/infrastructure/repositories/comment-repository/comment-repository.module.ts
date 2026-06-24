import { CommentEntity } from '@domain/entities/comment.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './comment-repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [CommentRepository],
  exports: [CommentRepository],
})
export class CommentRepositoryModule {}
