import { CommentEntity } from '@domain/entities/comment.entity';
import { CookieEntity } from '@domain/entities/cookie.entity';
import { GroupEntity } from '@domain/entities/group.entity';
import { LinkEntity } from '@domain/entities/links.entity';
import { PageEntity } from '@domain/entities/page.entity';
import { ProxyEntity } from '@domain/entities/proxy.entity';
import { TokenEntity } from '@domain/entities/token.entity';
import { UserEntity } from '@domain/entities/user.entity';
import { VpsEntity } from '@domain/entities/vps.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RestApiModule } from './app/controllers/rest-api/rest-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('DB_TYPE') as any,
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
        username: configService.get<string>('DB_USER_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          LinkEntity,
          VpsEntity,
          ProxyEntity,
          TokenEntity,
          CookieEntity,
          CommentEntity,
          GroupEntity,
          PageEntity,
          UserEntity,
        ],
      }),
    }),
    ScheduleModule.forRoot(),
    RestApiModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
