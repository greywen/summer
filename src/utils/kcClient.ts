import config from '@config/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';
export default class KcClient {
  static kcAdminClient = new KcAdminClient();
  static async auth() {
    this.kcAdminClient.setConfig({
      baseUrl: config.keycloak.clientBaseUrl,
      realmName: config.keycloak.realm,
    });
    await this.kcAdminClient.auth({
      username: config.keycloak.username,
      password: config.keycloak.password,
      grantType: config.keycloak.clientGrantType,
      clientId: config.keycloak.clientId,
      clientSecret: config.keycloak.clientSecret,
    });
  }
}
