import { ONE_MINUTE } from '../../../application/constants/milissecond.duration';
import { RedisConfig } from '../types/redis.interface';

export const REDIS_TOKEN = Symbol('redis');

export const redisEnv = (): { redis: RedisConfig } => {
  const { REDIS_PORT, REDIS_HOST, REDIS_TTL } = process.env;

  return {
    redis: {
      host: REDIS_HOST!,
      port: REDIS_PORT!,
      ttl: parseInt(REDIS_TTL ?? `${5 * ONE_MINUTE}`, 10),
    },
  };
};
