import config from "@config/config";

const { password, host, port } = config.redis;
export const redisModuleOptions = {
    config: {
        url: `redis://:${password}@${host}:${port}`
    }
}

const { secret, expiresIn } = config.jwt;
export const jwtModuleOptions = {
    secret: secret,
    signOptions: { expiresIn: expiresIn },

}