import { ServerEnvironment } from '@constants/server';
import { GrantTypes } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import * as config from 'config';
interface IConfig {
  server: {
    port: number;
    environment: ServerEnvironment;
  };
  services: {
    languageService: string;
  };
  dingTalk: {
    bossId: string;
    conversationId: string;
    templateId: string;
    apikey: string;
    apisecret: string;
    apiUrl: string;
    v1ApiUrl: string;
    v2ApiUrl: string;
    // 分钟
    tokenExpires: number;
  };
  aliSms: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: string;
    apiVersion: string;
  };
  smsTemplate: {
    code: string;
    signName: string;
  };
  job: {
    attendanceRule: string;
    reportRule: string;
    saveTimeSheetRule: string;
    keyCloakAuthRule: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  keycloak: {
    realm: string;
    issuer: string;
    redirectUri: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    grantType: string;
    logoutRedirectUri: string;
    clientBaseUrl: string;
    username: string;
    password: string;
    clientGrantType: GrantTypes;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  postgresql: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: boolean;
    synchronize: boolean;
    logging: boolean;
  };
}

export default <IConfig>{
  server: {
    port: config.get('server.port'),
    environment: config.get('server.environment'),
  },
  services: config.get('services'),
  dingTalk: {
    bossId: config.get('dingTalk.bossId'),
    conversationId: config.get('dingTalk.conversationId'),
    templateId: config.get('dingTalk.templateId'),
    apikey: config.get('dingTalk.apikey'),
    apisecret: config.get('dingTalk.apisecret'),
    apiUrl: config.get('dingTalk.apiUrl'),
    v1ApiUrl: config.get('dingTalk.v1ApiUrl'),
    v2ApiUrl: config.get('dingTalk.v2ApiUrl'),
    tokenExpires: config.get('dingTalk.tokenExpires'),
  },
  aliSms: {
    accessKeyId: config.get('aliSms.accessKeyId'),
    accessKeySecret: config.get('aliSms.accessKeySecret'),
    endpoint: config.get('aliSms.endpoint'),
    apiVersion: config.get('aliSms.apiVersion'),
  },
  smsTemplate: {
    code: config.get('smsTemplate.code'),
    signName: config.get('smsTemplate.signName'),
  },
  job: config.get('job'),
  redis: {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    password: config.get('redis.password'),
  },
  keycloak: config.get('keycloak'),
  jwt: {
    secret: config.get('jwt.secret'),
    expiresIn: config.get('jwt.expiresIn'),
  },
  postgresql: config.get('postgresql'),
};
