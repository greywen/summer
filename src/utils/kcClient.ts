import config from '@config/config';
import { Issuer, BaseClient } from 'openid-client';
export default class KcClient {
  static client: BaseClient;
  static async init() {
    const { clientId, clientSecret, redirectUri, issuer } = config.keycloak;
    const keycloakIssuer = await Issuer.discover(issuer);
    this.client = new keycloakIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
      response_types: ['code'],
    });
  }
}
