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
      dingTalkUserId: payload.dingTalkUserId,
      userId: payload.userId,
      username: payload.username,
      roles: payload.roles,
      idToken: payload.idToken,
    };
  }
}
