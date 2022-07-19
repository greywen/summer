import { IKeyCloakUserInfo, IUserResultInfo } from '@interfaces/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import NodeKeycloak from 'node-keycloak';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signin(code: string, session_state: string): Promise<IUserResultInfo> {
    try {
      const result = await NodeKeycloak.callback({
        code: code,
        session_state: session_state,
      });
      const userinfo = await NodeKeycloak.userinfo(result.access_token);
      const keyCloakUserInfo = <IKeyCloakUserInfo>(
        jwt.decode(result.access_token)
      );

      return {
        expires_at: result.expires_at,
        access_token: this.jwtService.sign({
          userId: keyCloakUserInfo.sub,
          dingUserId: keyCloakUserInfo.dingUserId,
          username: keyCloakUserInfo.preferred_username,
          departmentIds: keyCloakUserInfo.departmentids?.split(',') || [],
          idToken: result.id_token,
          resources: keyCloakUserInfo.resourceIds?.split(',') || [],
        }),
        refresh_expires_in: result.refresh_expires_in as string,
        refresh_token: result.refresh_token,
        username: userinfo.preferred_username,
        email: userinfo.email,
        phone: userinfo.phoneNumber as string,
        avatar: userinfo.avatar as string,
        title: userinfo.title as string,
        hiredDate: userinfo.hiredDate as string,
        resources: keyCloakUserInfo.resourceIds?.split(',') || [],
      };
    } catch (e) {
      console.log('Login error: ', e);
    }
  }

  async signout(token: string) {
    return await await NodeKeycloak.signout(token);
  }
}
