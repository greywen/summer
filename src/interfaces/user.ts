export interface IUserTokenInfo {
  access_token: string;
  sub: string;
  realm_access: {
    roles: string[];
  };
  preferred_username: string;
  name: string;
  expires_at: number;
}

export class IUserInfo {
  dingTalkUserId: string;
  userId: string;
  name: string;
  username: string;
  roles: string[];
  token: string;
  expires: number;
  refreshToken: string;
  refreshExpires: number;
  accessToken: string;
  hiredDate: number;
}
