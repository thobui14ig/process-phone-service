import { TokenEntity } from '@domain/entities/token.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRepository } from './token-repository';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [TokenRepository],
  exports: [TokenRepository],
})
export class TokenRepositoryModule {}
