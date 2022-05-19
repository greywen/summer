import config from '@config/config';
import { NestFactory } from '@nestjs/core';
import KcClient from '@utils/kcClient';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors();
  await KcClient.init();
  await app.listen(config.server.port);
}
bootstrap();
