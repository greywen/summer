export interface IUserResultInfo {
  refresh_token: string;
  expires_at: number;
  access_token: string;
  refresh_expires_in: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  hiredDate: string;
}

export class IUserInfo {
  userId: string;
  dingUserId: string;
  username: string;
  email: string;
  resourceAccess: string;
  realmAccess: string;
  phone: string;
  idToken: string;
}

export interface IKeyCloakUserInfo {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  realm_access: IRealmaccess;
  resource_access: any;
  scope: string;
  sid: string;
  dingUserId: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  locale: string;
  family_name: string;
  email: string;
}

interface IRealmaccess {
  roles: string[];
}
