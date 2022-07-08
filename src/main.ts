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
  const kcAdminClient = new KcAdminClient();
  kcAdminClient.setConfig({
    baseUrl: config.keycloak.clientBaseUrl,
    realmName: config.keycloak.realm,
  });
  await kcAdminClient.auth({
    username: config.keycloak.username,
    password: config.keycloak.password,
    grantType: config.keycloak.clientGrantType,
    clientId: config.keycloak.clientId,
    clientSecret: config.keycloak.clientSecret,
  });
  const user = await kcAdminClient.users.findOne({
    id: '63d48ab2-c599-45c2-adc2-61f464255ce0',
  });
  // user.attributes = [...users.attributes,]
  // kcAdminClient.users.update(
  //   { id: '63d48ab2-c599-45c2-adc2-61f464255ce0' },
  //   user,
  // );
  const groups = await kcAdminClient.groups.find();
  console.log(user);
  console.log(groups);
  console.log(groups[0].subGroups);
  await app.listen(config.server.port);
}
bootstrap();
