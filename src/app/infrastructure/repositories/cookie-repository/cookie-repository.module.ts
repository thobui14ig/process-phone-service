import { CookieEntity } from '@domain/entities/cookie.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieRepository } from './cookie-repository';

@Module({
  imports: [TypeOrmModule.forFeature([CookieEntity])],
  providers: [CookieRepository],
  exports: [CookieRepository],
})
export class CookieRepositoryModule {}
