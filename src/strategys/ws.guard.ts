import config from "@config/config";
import { CanActivate, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class WsGuard implements CanActivate {
    canActivate(context: any): boolean | any | Promise<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, config.jwt.secret) as any;
            context.args[0].data = decoded;
            return decoded;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}