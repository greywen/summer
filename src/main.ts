import config from '@config/config';
import { NestFactory } from '@nestjs/core';
import KcClient from '@utils/kcClient';
import NodeKeycloak from 'node-keycloak';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors();
  await NodeKeycloak.configure({
    issuer: config.keycloak.issuer,
    client_id: config.keycloak.clientId,
    client_secret: config.keycloak.clientSecret,
    login_redirect_uri: config.keycloak.logoutRedirectUri,
    logout_redirect_uri: config.keycloak.logoutRedirectUri,
  });
  await KcClient.auth();
  await app.listen(config.server.port);
}
bootstrap();
