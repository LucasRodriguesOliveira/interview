import { IMongoDBConfig } from '../types/mongodb.interface';

export const MONGODB_TOKEN = Symbol('mongodb');

type MongodbConfig = {
  mongodb: IMongoDBConfig;
};

export const mongodbEnv = (): MongodbConfig => {
  const { MONGODB_URL, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

  return {
    mongodb: {
      url: MONGODB_URL!,
      password: DB_PASSWORD!,
      user: DB_USERNAME!,
      database: DB_NAME!,
    },
  };
};
