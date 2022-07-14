import { UserDepartment } from '@entities/user.department.entity';
import { IKeyCloakUserInfo, IUserResultInfo } from '@interfaces/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import NodeKeycloak from 'node-keycloak';
import { Repository } from 'typeorm';
import { UserDepartmentService } from './department.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserDepartment)
    private readonly userDepartmentRepository: Repository<UserDepartment>,
    private readonly userDepartmentService: UserDepartmentService,
  ) {}

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
      const userDepartement = await this.userDepartmentRepository.findOneBy({
        userid: userinfo.sub,
      });
      console.log('userDepartement', userDepartement);
      return {
        expires_at: result.expires_at,
        access_token: this.jwtService.sign({
          userId: keyCloakUserInfo.sub,
          dingUserId: keyCloakUserInfo.dingUserId,
          username: keyCloakUserInfo.preferred_username,
          departmentIds: userDepartement.departmentids,
          idToken: result.id_token,
        }),
        refresh_expires_in: result.refresh_expires_in as string,
        refresh_token: result.refresh_token,
        username: userinfo.preferred_username,
        email: userinfo.email,
        phone: userinfo.phoneNumber as string,
        avatar: userinfo.avatar as string,
        title: userinfo.title as string,
        hiredDate: userinfo.hiredDate as string,
      };
    } catch (e) {
      console.log('Login error: ', e);
    }
  }

  async signout(token: string) {
    return await await NodeKeycloak.signout(token);
  }
}
