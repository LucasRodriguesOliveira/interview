import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisConfig } from '../types/redis.interface';
import { createKeyv, Keyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { REDIS_TOKEN } from '../env/redis.env';

export const redisConfig: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const redisEnv = configService.getOrThrow<RedisConfig>(
      REDIS_TOKEN.description!,
    );

    const redisUrl = `redis://${redisEnv.host}:${redisEnv.port}`;

    return {
      stores: [
        new Keyv({
          store: new Cacheable({ ttl: redisEnv.ttl }),
        }),
        createKeyv(redisUrl),
      ],
    };
  },
};
