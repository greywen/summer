import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '@config/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IUserInfo } from '@interfaces/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: IUserInfo) {
    return {
      dingUserId: payload.dingUserId,
      userId: payload.userId,
      username: payload.username,
      departmentIds: payload.departmentIds,
      idToken: payload.idToken,
      resources: payload.resources,
    };
  }
}
