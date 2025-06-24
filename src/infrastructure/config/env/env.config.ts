import { ConfigModuleOptions } from '@nestjs/config';
import { envSchema } from '../schema/env.schema';
import { mongodbEnv } from './mongodb.env';
import { appEnv } from './app.env';
import { pinoEnv } from './pino.env';
import { swaggerEnv } from './swagger.env';
import { redisEnv } from './redis.env';

export const envConfig: ConfigModuleOptions = {
  load: [appEnv, mongodbEnv, pinoEnv, swaggerEnv, redisEnv],
  validationSchema: envSchema,
  isGlobal: true,
};
