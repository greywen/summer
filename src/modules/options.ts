import config from '@config/config';
import { join } from 'path';

const { password, host, port } = config.redis;
export const redisModuleOptions = {
  config: {
    url: `redis://:${password}@${host}:${port}`,
  },
};

const { secret, expiresIn } = config.jwt;
export const jwtModuleOptions = {
  secret: secret,
  signOptions: { expiresIn: expiresIn },
};

export const typeOrmOptions = {
  type: 'postgres' as any,
  ...config.postgresql,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrationsTableName: 'migration',
  migrations: ['src/migration/*.ts'],
};
