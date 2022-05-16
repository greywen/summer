import config from "@config/config";

const { password, host, port } = config.redis;
export const redisModuleOptions = {
    url: `redis://:${password}@${host}:${port}`,
    onClientReady: (client) => {
        client.on('error', (err) => { }
        )
    }
}

const { secret, expiresIn } = config.jwt;
export const jwtModuleOptions = {
    secret: secret,
    signOptions: { expiresIn: expiresIn },

}