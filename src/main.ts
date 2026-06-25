import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5000);
  await app.listen(port);
  console.log(`Start port ${port}`);
}
bootstrap();
