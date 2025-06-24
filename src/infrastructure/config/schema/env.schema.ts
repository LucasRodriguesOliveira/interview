import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  MONGODB_URL: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  PORT: Joi.string().required(),
  API_NAME: Joi.string(),
  API_DESCRIPTION: Joi.string(),
  API_VERSION: Joi.string(),
  REDIS_PORT: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_TTL: Joi.string().required(),
});
