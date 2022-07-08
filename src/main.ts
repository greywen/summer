import config from '@config/config';
import { NestFactory } from '@nestjs/core';
import NodeKeycloak from 'node-keycloak';
import { AppModule } from './app.module';
import KcAdminClient from '@keycloak/keycloak-admin-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.enableCors();
  await NodeKeycloak.configure({
    issuer: config.keycloak.issuer,
    client_id: config.keycloak.clientId,
    client_secret: config.keycloak.clientSecret,
    login_redirect_uri: config.keycloak.logoutRedirectUri,
  });
  // const kcAdminClient = new KcAdminClient();
  // kcAdminClient.setConfig({
  //   baseUrl: 'https://identity.starworks.cc/',
  //   realmName: 'MFF',
  // });
  // await kcAdminClient.auth({
  //   username: '文旺',
  //   password: 'Ww111111',
  //   grantType: 'password',
  //   clientId: config.keycloak.clientId,
  //   // grantType: 'client_credentials',
  //   // clientId: config.keycloak.clientId,
  //   // clientSecret: config.keycloak.clientSecret,
  // });
  // const users = await kcAdminClient.users.find();
  // console.log(users);
  await app.listen(config.server.port);
}
bootstrap();
