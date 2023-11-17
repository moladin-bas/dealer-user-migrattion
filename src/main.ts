import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DEFAULT_PORT } from './common/constants/app';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      transform: true,
    }),
  );

  await app.listen(process.env.APP_PORT || DEFAULT_PORT);
}
bootstrap();
