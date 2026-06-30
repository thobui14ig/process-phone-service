import { CommentEntity } from '@domain/entities/comment.entity';
import { ProxyEntity } from '@domain/entities/proxy.entity';
import { TokenEntity } from '@domain/entities/token.entity';
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
          ProxyEntity,
          TokenEntity,
          CommentEntity,
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
