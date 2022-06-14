import * as config from 'config';
interface IConfig {
  server: {
    port: number;
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
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default <IConfig>{
  server: {
    port: config.get('server.port'),
  },
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
  job: {
    attendanceRule: config.get('job.attendanceRule'),
    reportRule: config.get('job.reportRule'),
    saveTimeSheetRule: config.get('job.saveTimeSheetRule'),
  },
  redis: {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    password: config.get('redis.password'),
  },
  keycloak: {
    realm: config.get('keycloak.realm'),
    issuer: config.get('keycloak.issuer'),
    clientId: config.get('keycloak.clientId'),
    redirectUri: config.get('keycloak.redirectUri'),
    scope: config.get('keycloak.scope'),
    clientSecret: config.get('keycloak.clientSecret'),
    grantType: config.get('keycloak.grantType'),
    logoutRedirectUri: config.get('keycloak.logoutRedirectUri'),
  },
  jwt: {
    secret: config.get('jwt.secret'),
    expiresIn: config.get('jwt.expiresIn'),
  },
};
