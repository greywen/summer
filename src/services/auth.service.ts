import config from "@config/config";
import { IUserInfo, IUserTokenInfo } from "@interfaces/user";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import KcClient from "@utils/kcClient";
import * as jwt from "jsonwebtoken";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async signin(code: string, state: string, session_state: string) {
        try {
            const result = await KcClient.client.callback(config.keycloak.redirectUri, { code: code, state: state, session_state: session_state });
            let data = <IUserTokenInfo>jwt.decode(result.access_token);
            let dingTalkUserInfo = await this.userService.getDingTalkUserInfoByName(data.preferred_username);

            const userToken = <IUserInfo>{
                name: data.name,
                username: data.preferred_username,
                roles: data.realm_access.roles,
                accessToken: result.access_token,
                hiredDate: dingTalkUserInfo?.hired_date,
            }
            return {
                ...userToken,
                refreshToken: result.refresh_token,
                refreshExpires: result.refresh_expires_in,
                expires: result.expires_at,
                token: this.jwtService.sign({ ...userToken, userId: data.sub, dingTalkUserId: dingTalkUserInfo?.id }),
            }
        } catch (e) {
            console.log("Login error: ", e);
        }
    }

    async signout() {
        return await KcClient.client.endSessionUrl();
    }
}